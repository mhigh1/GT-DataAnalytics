import numpy as np
from numpy.testing._private.utils import measure
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Station = Base.classes.station
Measurement = Base.classes.measurement

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs</br>"
        f"/api/v1.0/date_start</br>"
        f"/api/v1.0/date_start/date_end"

    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all precipitation measurements
    results = session.query(Measurement.date, Measurement.prcp).all()
    session.close()

    # Create a dictionary from the row data and append to a list
    precipitation_data = []
    for date, prcp in results:
        date_dict = {}
        date_dict[date] = prcp
        precipitation_data.append(date_dict)

    return jsonify(precipitation_data)


@app.route("/api/v1.0/stations")
def stations():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all precipitation measurements
    results = session.query(Station.station).all()
    session.close()

    # Convert list of tuples into a normal list
    stations = list(np.ravel(results))
    
    return jsonify(stations)


@app.route("/api/v1.0/tobs")
def tobs():
    session = Session(engine)
    end_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()[0]
    start_date = dt.datetime.strptime(end_date, "%Y-%m-%d") - dt.timedelta(days=365)

    # Determine the most active station
    top_station = session.query(Measurement.station, func.count(Measurement.station))\
        .group_by(Measurement.station)\
        .order_by(func.count(Measurement.station).desc())\
        .all()[0][0]

    # Get data for the most active station
    records = session.query(Measurement.date, Measurement.prcp)\
        .filter(func.strftime("%Y-%M-%d", Measurement.date) >= start_date)\
        .filter(Measurement.station == top_station)\
        .all()\
    
    session.close()

    # Init result array
    result = []

    # Init single entry for top station
    entry = {}
    entry["station"] = top_station
    entry["values"] = []
        
    # Populate values array with precip data for top station
    for date, tobs in records:
        tobs_dict = {}
        tobs_dict[date] = tobs
        entry["values"].append(tobs_dict)

    # Append the entry to the result array
    result.append(entry)
    
    return jsonify(result)


@app.route("/api/v1.0/<start>")
def date_start(start):
    session = Session(engine)

    tobs = [
        func.min(Measurement.tobs),
        func.max(Measurement.tobs),
        func.avg(Measurement.tobs)
    ]

    records = session.query(*tobs)\
        .filter(func.strftime("%Y-%m-%d", Measurement.date) > start)\
        .all()

    result = []
    for record in records:
        entry = {}
        entry["tmin"] = record[0]
        entry["tmax"] = record[1]
        entry["tavg"] = record[2]
        result.append(entry)

    return jsonify(result)


@app.route("/api/v1.0/<start>/<end>")
def date_range(start, end):
    session = Session(engine)

    tobs = [
        func.min(Measurement.tobs),
        func.max(Measurement.tobs),
        func.avg(Measurement.tobs)
    ]

    records = session.query(*tobs)\
        .filter(func.strftime("%Y-%m-%d", Measurement.date).between(start, end))\
        .all()

    result = []
    for record in records:
        entry = {}
        entry["tmin"] = record[0]
        entry["tmax"] = record[1]
        entry["tavg"] = record[2]
        result.append(entry)

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
