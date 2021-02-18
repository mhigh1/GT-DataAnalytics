Attribute VB_Name = "Analyzer"

'Declare Global Variables
Private ActiveSumTableRow As Long

Sub Main()
    'Declare Variables
    Dim Sheet As Worksheet
    
    'Create SummaryTable Worksheet
    CreateSummaryTable
    
    'Set starting row for summary table
    ActiveSumTableRow = 2
        
    'Iterate through each worksheet in the active workbook
    'Analyze each worksheet if it is not the "SumamryTable" sheet
    For Each Sheet In Worksheets
        If Not Sheet.Name = "SummaryTable" Then
            AnalyzeWorksheet Sheet
        End If
    Next Sheet
    
    'Apply Formatting to the Summary Table
    ApplySumTableFormatting
    
    'Generate Top Performers metrics on SummaryTable worksheet
    TopPerformers
End Sub

Private Sub AnalyzeWorksheet(Sheet As Worksheet)
    'Declare Variables
    Dim LastRow As Long
    Dim Symbol As String
    Dim rDate As Date
    Dim OpenPrice As Double
    Dim ClosePrice As Double
    Dim Vol As Long
    Dim TotalVol As Variant
        
    'Find the last row with data
    LastRow = Sheet.Cells(Rows.Count, 1).End(xlUp).Row
    
    'Interate each row
    For i = 2 To LastRow
        
        'Get values from current row
        Symbol = Sheet.Cells(i, 1).Value
        rDate = CDate(Format(Sheet.Cells(i, 2).Value, "0000-00-00"))
        Vol = Sheet.Cells(i, 7).Value
        TotalVol = TotalVol + Vol
        
        'If current row's ticker doesn't match previous row, set OpenPrice
        If Sheet.Cells(i, 1).Value <> Sheet.Cells(i - 1, 1).Value Then
            OpenPrice = Sheet.Cells(i, 3).Value
        End If
        
        'If next row's ticker doesn't match current row, write summary, and reset variables
        If Sheet.Cells(i + 1, 1).Value <> Sheet.Cells(i, 1).Value Then
            ClosePrice = Sheet.Cells(i, 6).Value
            
            'Write Summary Row to Table
            AddSummaryRow Symbol, Year(rDate), OpenPrice, ClosePrice, TotalVol
            
            'Reset Variables
            TotalVol = 0
            OpenPrice = 0
            ClosePrice = 0
            ActiveSumTableRow = ActiveSumTableRow + 1
        End If
    Next i
End Sub

Private Sub CreateSummaryTable()
    'Declare variables
    Dim SumSheet As Worksheet
    
    'If the Summary Table sheet doesn't exist, create it
    If Not SheetExists("SummaryTable") Then
        Set SumSheet = ActiveWorkbook.Sheets.Add(After:=ActiveWorkbook.Worksheets(ActiveWorkbook.Worksheets.Count))
        SumSheet.Name = "SummaryTable"
    Else
        Set SumSheet = Worksheets("SummaryTable")
    End If
    
    'Add Column Headers to Summary Table
    SumSheet.Range("A1").Value = "Ticker"
    SumSheet.Range("B1").Value = "Year"
    SumSheet.Range("C1").Value = "Annual_Change"
    SumSheet.Range("D1").Value = "Percent_Change"
    SumSheet.Range("E1").Value = "Total_Vol"
    
    'Apply Header Style
    With SumSheet.Range("A1:E1")
        .Interior.ColorIndex = 1
        .Font.ColorIndex = 2
        .Font.Bold = True
    End With
    
    'Enable AutoFilter if not enabled
    If SumSheet.AutoFilterMode = False Then
        SumSheet.Range("A1:E1").AutoFilter
    End If
End Sub

Private Sub AddSummaryRow(Symbol As String, Year As String, OpenPrice As Double, ClosePrice As Double, TotalVol As Variant)
    'Declare Variables
    Dim SumSheet As Worksheet
    Dim PercentChange As Double
    
    'Check if the SummaryTable sheet exists, if it doesn't create it, otherwise initalize SumSheet
    If Not SheetExists("SummaryTable") Then
        CreateSummaryTable
        Set SumSheet = Worksheets("SummaryTable")
    Else
        Set SumSheet = Worksheets("SummaryTable")
    End If
    
    'Handle Divide-by-Zero Condition for PercentChanged
    If OpenPrice <> 0 Then
        PercentChanged = ((ClosePrice - OpenPrice) / OpenPrice)
    Else
        PercentChanged = 0
    End If
    
    'Add values to row for each column
    SumSheet.Range("A" & ActiveSumTableRow).Value = Symbol
    SumSheet.Range("B" & ActiveSumTableRow).Value = Year
    SumSheet.Range("C" & ActiveSumTableRow).Value = ClosePrice - OpenPrice
    SumSheet.Range("D" & ActiveSumTableRow).Value = PercentChanged
    SumSheet.Range("E" & ActiveSumTableRow).Value = TotalVol
End Sub

Private Sub ApplySumTableFormatting()
    'Declare Variables
    Dim SumSheet As Worksheet
    Dim LastRow As Long
    
    'Check if the SummaryTable sheet exists, if it doesn't create it, otherwise initalize SumSheet
    If Not SheetExists("SummaryTable") Then
        CreateSummaryTable
        Set SumSheet = Worksheets("SummaryTable")
    Else
        Set SumSheet = Worksheets("SummaryTable")
    End If
    
    'Get number of rows in the summary data
    LastRow = SumSheet.Cells(Rows.Count, "A").End(xlUp).Row
    
    'Format column B (Annual_Change) As Number
    SumSheet.Columns("C").NumberFormat = "0.00"
    
    'Format Column C (Percent_Change) as Percentages
    SumSheet.Columns("D").NumberFormat = "0.00%"

    'Set Column width to fit content
    SumSheet.Columns("A:E").AutoFit
    
    'Delete all existing Conditional Formats from SummaryTable sheet
    SumSheet.Cells.FormatConditions.Delete
    
    'Conditional Format
    'Color cells containing negative values Red
    With SumSheet.Range("C2:D" & LastRow).FormatConditions.Add(xlCellValue, xlLess, "=0")
        .Interior.ColorIndex = 3
        .StopIfTrue = False
    End With
    
    'Color cells containing postive values Green
    With SumSheet.Range("C2:D" & LastRow).FormatConditions.Add(xlCellValue, xlGreater, "=0")
        .Interior.ColorIndex = 4
        .StopIfTrue = False
    End With
    
    'Color cells containing zero values Gray
    With SumSheet.Range("C2:D" & LastRow).FormatConditions.Add(xlCellValue, xlEqual, "=0")
        .Interior.ColorIndex = 15
        .StopIfTrue = False
    End With
End Sub

Private Sub TopPerformers()
    'Declare Variables
    Dim SumSheet As Worksheet
    Dim ActivePerformersTableRow As Integer
    Dim LastRow As Long
    Dim rYear As String
    Dim MaxVolSymbol As String
    Dim MaxVol As Variant
    Dim MaxPercentSymbol As String
    Dim MaxPercent As Double
    Dim MinPercentSymbol As String
    Dim MinPercent As Double
    
    'Initalize Sheet to use for Performers Metrics
    Set SumSheet = Worksheets("SummaryTable")

    'Set starting row for summary table
    ActivePerformersTableRow = 2

    'Get number of rows in the summary data
    LastRow = SumSheet.Cells(Rows.Count, 1).End(xlUp).Row
    
    'Setup Performers Table header row
    With SumSheet
        .Range("I1").Value = "Year"
        .Range("J1").Value = "Ticker"
        .Range("K1").Value = "Value"
    End With
    
    ' Apply header style to Performers Table
    With SumSheet.Range("H1:K1")
        .Interior.ColorIndex = 1
        .Font.ColorIndex = 2
        .Font.Bold = True
    End With
    
    'Interate through each row of summary data
    For i = 2 To LastRow
        'Capture the Year from the current row
        rYear = SumSheet.Cells(i, 2).Value
    
        'If current row's annual vol is > MaxVol then capture Symbol and MaxVol
        If SumSheet.Cells(i, 5).Value > MaxVol Then
            MaxVolSymbol = SumSheet.Cells(i, 1).Value
            MaxVol = SumSheet.Cells(i, 5).Value
        End If
        
        'If current row's percentage is > MaxPercent then capture Symbol and MaxPercent
        If SumSheet.Cells(i, 4).Value > MaxPercent Then
            MaxPercentSymbol = SumSheet.Cells(i, 1).Value
            MaxPercent = SumSheet.Cells(i, 4).Value
        'If the current row's percentage is < MinPercent than capture Symbol and MinPercent
        ElseIf SumSheet.Cells(i, 4).Value < MinPercent Then
            MinPercentSymbol = SumSheet.Cells(i, 1).Value
            MinPercent = SumSheet.Cells(i, 4).Value
        End If
        
        'If the next row's year is different from the current row, then output results for the year
        If SumSheet.Cells(i + 1, 2).Value <> SumSheet.Cells(i, 2).Value Then
            'Result row for greatest total volume
            SumSheet.Range("H" & ActivePerformersTableRow).Value = "Greatest Total Volume"
            SumSheet.Range("I" & ActivePerformersTableRow).Value = rYear
            SumSheet.Range("J" & ActivePerformersTableRow).Value = MaxVolSymbol
            SumSheet.Range("K" & ActivePerformersTableRow).Value = MaxVol
            ActivePerformersTableRow = ActivePerformersTableRow + 1
            
            'Result row for greatest percent increase
            SumSheet.Range("H" & ActivePerformersTableRow).Value = "Greatest % Increase"
            SumSheet.Range("I" & ActivePerformersTableRow).Value = rYear
            SumSheet.Range("J" & ActivePerformersTableRow).Value = MaxPercentSymbol
            With SumSheet.Range("K" & ActivePerformersTableRow)
                .Value = MaxPercent
                .NumberFormat = "0.00%"
            End With
            ActivePerformersTableRow = ActivePerformersTableRow + 1
            
            'Result row for greatest percent decrease
            SumSheet.Range("H" & ActivePerformersTableRow).Value = "Greatest % Decrease"
            SumSheet.Range("I" & ActivePerformersTableRow).Value = rYear
            SumSheet.Range("J" & ActivePerformersTableRow).Value = MinPercentSymbol
            With SumSheet.Range("K" & ActivePerformersTableRow)
                .Value = MinPercent
                .NumberFormat = "0.00%"
            End With
            ActivePerformersTableRow = ActivePerformersTableRow + 1
            
            'Reset temp variables
            MaxVol = 0
            MaxPercent = 0
            MinPercent = 0
        End If
    Next i
    
    'AutoFit content in Top Performers Table
    SumSheet.Columns("H:K").AutoFit
End Sub

Function SheetExists(Name As String) As Boolean
    SheetExists = False
    For Each Sheet In Worksheets
        If Sheet.Name = Name Then
            SheetExists = True
        End If
    Next Sheet
End Function
