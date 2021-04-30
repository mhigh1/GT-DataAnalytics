# Dependencies
import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

def scrape():
    # Set up Splinter
    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=False)

    ## NASA Mars News
    url = "https://mars.nasa.gov/news/"
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")

    # Get First News Article from List and store title and description
    news_feed = soup.find("section", class_="grid_gallery")
    article = news_feed.find("li")
    news_title = article.find("div", class_="content_title").get_text()
    news_desc = article.find("div", class_="article_teaser_body").get_text()

    ## PL Mars Space Images - Featured Image
    url = "https://data-class-jpl-space.s3.amazonaws.com/JPL_Space/index.html"
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")

    # Get featured image path
    base_url = "https://data-class-jpl-space.s3.amazonaws.com/JPL_Space"
    featured_image_rel_path = soup.find("img", class_="headerimage")["src"]
    featured_image_url = f"{base_url}/{featured_image_rel_path}"

    ## Mars Facts
    url = "https://space-facts.com/mars/"

    tables = pd.read_html(url)
    df = tables[0]
    df.rename(columns={0:"Description", 1:"Mars"}, inplace=True)
    df.set_index("Description", inplace=True)

    # Convert to html table
    html_table = df.to_html(header=False, index_names=False, border=0, classes=["table","table-striped","table-bordered"])

    # strip unneccessry line endings
    html_table = html_table.replace('\n', '')

    ## Mars Hemispheres
    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(url)

    url_root = "https://astrogeology.usgs.gov"
    hemisphere_image_urls = []
    links = []
    divs = browser.find_by_tag("div").find_by_css(".description")

    # Get links of each sub-page
    for el in divs:
        link = el.find_by_tag("a").first["href"]
        links.append(link)

    # For each subpage, navigate to it and scrape title and img url
    for link in links:
        browser.visit(link)
        html = browser.html
        soup = BeautifulSoup(html, "html.parser")
        
        # Get values
        title = soup.find("h2", class_="title").get_text()
        img_rel_url = soup.find("img", class_="wide-image")["src"]

        # Add object to list
        hemisphere_image_urls.append(
            {
                "title": title,
                "img_url": url_root + img_rel_url
            }
        )

    browser.quit()

    result = {
        "news_article": {
            "title": news_title,
            "description": news_desc
        },
        "featured_image_url": featured_image_url,
        "facts_table": html_table,
        "hemisphere_image_urls": hemisphere_image_urls
    }

    return result