#!/usr/bin/python3
#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 20/06/2021
# python-v  | 3.7.3
# -
# file      | WS-web_backendServer.py
# project   | rpi-weatherstation-web
# project-v | 1.0.0 (beta)
#

# ---------------------------
#   HTTP STATUS ERROR CODES:
#   1xxxx = OK
#   11xxx = CALCULATION-Error --> calculateValues()
#   1x1xx = SQL-RETRIEVE-Error --> retrieveDataFromSQL()
#   1xx1x = DATABASELIST-RETRIEVE-Error --> retrieveSQLDatabaseList()
#   1xxx1 = SPLIT-Error --> splitInput()
# ---------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sqlite3
import os
from datetime import datetime

# creates webserverinstance
app = FastAPI()

# timeservice for consoleoutput
def getTime():
    curTime = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    return curTime

# httprequest origins --> "*" = wildcard, means all origins are allowed
origins = [
    "*",
    "http://localhost",
    "http://localhost:8000"
]

# webserverconfig
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# retrieves of days from given month
def getDays(selectedMonth):
    days = 0
    # days per month (calendar)
    monthSetting = {"28":["02"],
                    "30":["04","06","09","11"],
                    "31":["01","03","05","07","08","10","12"]}
    for key in monthSetting:
        monthList = monthSetting[key]
        if str(selectedMonth) in monthList:
            days = key
            break
    return days

# INFO(!): in der folgenden Funktion sind Variablen teils nicht korrekt benannt --> Bsp.: sdInt ist kein Integer sondern eine Liste aus Strings(!), dies ist späteren Änderungen geschuldet
# retrieves filenames(! not databases) of required databases
# appends all filenames to a list and returns this list
# (ordersensitive)
# explanation can be found in the docs (key: retrieveSQLDatabaseList)
def retrieveSQLDatabaseList(startDate, endDate):
    sDInt = startDate.split("-")
    eDInt = endDate.split("-")
    dbList = []
    dbList.append(startDate + ".db")

    # calculates difference of days
    # if months are equal
    if (sDInt[1] == eDInt[1]):
        diff = int(eDInt[2]) - int(sDInt[2]) + 1
        counter = 1;
        while not diff == counter:
            day = int(sDInt[2]) + counter
            if day < 10: day = "0" + str(day)
            dbList.append(str(sDInt[0]) + "-" + str(sDInt[1]) + "-" + str(day) + ".db")
            counter += 1
    # if months are unequal (logical if first if == False)
    elif (sDInt[1] != eDInt[1]):
        # months to retrieve
        monthsDiff = int(eDInt[1]) - int(sDInt[1]) + 1
        monthsCounter = 0
        while not monthsDiff == monthsCounter:

            selectedMonth = int(sDInt[1]) + monthsCounter
            if selectedMonth < 10: selectedMonth = "0" + str(selectedMonth)
            days = int(getDays(selectedMonth))

            # first month
            if (int(sDInt[1]) + monthsCounter) == int(sDInt[1]):
                # days to retrieve
                reqDays = days - int(sDInt[2]) + 1
                reqDayCounter = 1
                while not reqDays == reqDayCounter:
                    selectedDay = int(sDInt[2]) + reqDayCounter
                    if int(selectedDay) < 10: selectedDay = "0" + str(selectedDay)
                    dbList.append(str(sDInt[0]) + "-" + sDInt[1] + "-" + str(selectedDay) + ".db")
                    reqDayCounter += 1
            
            # last month
            elif (int(sDInt[1]) + monthsCounter) == int(eDInt[1]):
                reqDays = int(eDInt[2]) + 1
                reqDayCounter = 1
                while not reqDays == reqDayCounter:
                    selectedDay = reqDayCounter
                    if int(selectedDay) < 10: selectedDay = "0" + str(selectedDay)
                    dbList.append(str(sDInt[0]) + "-" + eDInt[1] + "-" + str(selectedDay) + ".db")
                    reqDayCounter += 1
           
            # months between start- and endmonth
            else:
                reqDays = days + 1
                reqDayCounter = 1
                while not reqDayCounter == reqDays:
                    selectedDay = reqDayCounter
                    selectedMonth = int(sDInt[1]) + int(monthsDiff)
                    if int(selectedDay) < 10: selectedDay = "0" + str(selectedDay)
                    if int(selectedMonth) < 10: selectedMonth = "0" + str(selectedMonth)
                    selectedMonth = str(selectedMonth)
                    dbList.append(str(sDInt[0]) + "-" + selectedMonth + "-" + str(selectedDay) + ".db")
                    reqDayCounter += 1
            
            monthsCounter += 1

    return dbList

# splitting incoming data into list (from HTTP request --> splitting requested path)
def splitInput(input):
    values = input.split("_")
    return values

# selects the correct SQL table --> resolves key into db-table
def valueResolver(value):
    # databasestructure
    tableList = {
        "air_stats":["temperature","humidity","pressure"],
        "air_quality":["pm025","pm100"]
    }
    for key in tableList:
        vList = tableList[key]
        if value in vList:
            return key

# selects column from requested value and table
def columnSelector(value, table):
    # database/-tablestructure
    columnList = {
        "air_stats":{
            "timestamp":"0",
            "temperature":"1",
            "temperature_raw":"2",
            "humidity":"3",
            "pressure":"4",
            "cpu":"5",
            "ram":"6",
            "cputemp":"7"
        },
        "air_quality":{
            "timestamp":"0",
            "pm025":"1",
            "pm100":"2"
        }
    }
    return columnList[table][value]

# retrieves data from SQL to list from given daterange
# explanation can be found in the docs (key: retrieveDataFromSQL)
def retrieveDataFromSQL(dataBaseList, value1, value2, startDate, startTime, endDate, endTime):
    # static data and retrievestate storage
    dataValue1 = {}
    dataValue2 = {}
    # selecting start- and endhour (minutes --> rounded to base)
    startTimeFormatted = startTime.split("-")[0]
    endTimeFormatted = endTime.split("-")[0]
    firstRowFound = False
    lastRowReached = False

    # retrieving data from each database in list
    # "in" equals java's .contains()
    for database in dataBaseList:
        dbConnection = sqlite3.connect(os.getcwd() + "/dataStorage/" + database)
        dbCursor = dbConnection.cursor()

        # case: startDate and endDate are unequal 
        if not startDate == endDate:

            # case: current database equals startDate  
            if startDate in database:
                # case: values are equal
                if value2 != value1:
                    valueList = [value1, value2]
                    for value in valueList:
                        for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value)):
                            row = list(preRow)
                            timestamp = row[0].split("_")[1].split("-")[0]
                            if timestamp == startTimeFormatted:
                                # print(row[int(columnSelector(value1, valueResolver(value)))])
                                firstRowFound = True
                            if firstRowFound:
                                if value == value1:
                                    dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value)))]
                                elif value == value2:
                                    dataValue2[row[0]] = row[int(columnSelector(value2, valueResolver(value)))]
                        firstRowFound = False    
                # case: values are equal
                else:
                    for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value1)):
                        row = list(preRow)
                        timestamp = row[0].split("_")[1].split("-")[0]
                        if timestamp == startTimeFormatted:
                            firstRowFound = True
                        if firstRowFound:
                            dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value1)))]
                    firstRowFound = False    

            # case: current database equals endDate
            elif endDate in database:
                # case: values are unequal
                if value2 != value1:
                    valueList = [value1, value2]
                    for value in valueList:
                        for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value)):
                            row = list(preRow)
                            timestamp = row[0].split("_")[1].split("-")[0]
                            if timestamp == endTimeFormatted:
                                lastRowReached = True
                            if not lastRowReached:
                                if value == value1:
                                    dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value)))]
                                elif value == value2:
                                    dataValue2[row[0]] = row[int(columnSelector(value2, valueResolver(value)))]
                        lastRowReached = False    
                # case: values are equal
                else:
                    for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value1)):
                        row = list(preRow)
                        timestamp = row[0].split("_")[1].split("-")[0]
                        if timestamp == endTimeFormatted:
                            lastRowReached = True
                        if not lastRowReached:
                            dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value1)))]
                    lastRowReached = False  

            # case: database equals neither startDate nor endDate 
            else: 
                # case: values are unequal
                if value2 != value1:
                    valueList = [value1, value2]
                    for value in valueList:
                        for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value)):
                            row = list(preRow)
                            if value == value1:
                                dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value)))]
                            elif value == value2:
                                dataValue2[row[0]] = row[int(columnSelector(value2, valueResolver(value)))]
                # case: values are equal
                else: 
                    for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value1)):
                        row = list(preRow)
                        dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value1)))]

        # case: startDate and endDate are equal 
        else:    
            # case: values are unequal
            if value2 != value1:
                valueList = [value1, value2]
                for value in valueList:
                    for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value)):
                        row = list(preRow)
                        timestamp = row[0].split("_")[1].split("-")[0]
                        if timestamp == startTimeFormatted:
                            # print(row[int(columnSelector(value1, valueResolver(value)))])
                            firstRowFound = True
                        if timestamp == endTimeFormatted:
                            lastRowReached = True
                        if firstRowFound and not lastRowReached:
                            if value == value1:
                                dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value)))]
                            elif value == value2:
                                dataValue2[row[0]] = row[int(columnSelector(value2, valueResolver(value)))]
                    firstRowFound = False   
                    lastRowReached = False
            # case: values are equal
            else: 
                for preRow in dbCursor.execute("SELECT * FROM " + valueResolver(value1)):
                    row = list(preRow)
                    timestamp = row[0].split("_")[1].split("-")[0]
                    if timestamp == startTimeFormatted:
                        # print(row[int(columnSelector(value1, valueResolver(value)))])
                        firstRowFound = True
                    if timestamp == endTimeFormatted:
                        lastRowReached = True
                    if firstRowFound and not lastRowReached:
                        dataValue1[row[0]] = row[int(columnSelector(value1, valueResolver(value1)))]

                firstRowFound = False   
                lastRowReached = False
        
        dbConnection.close()
    '''
    for key in dataValue1:
        print(str(key) + " : " + str(dataValue1[key]))
    for key in dataValue2:
        print(str(key) + " : " + str(dataValue2[key]))
    '''
    print(getTime(), "[PROCESS-INFO] retrieved data from " + str(len(dataBaseList)) + " databases")
    if value1 == value2: dataValue2["empty"] = "empty"
    return dataValue1, dataValue2

# gets divisor from lowest count of values 
# count of values = (1*(pm025 || pm100) = 2*(temperature || humidity || pressure))
def getDivisor(dataValue1, dataValue2):
    divisor = 0;
    dataValue1Length = len(dataValue1.keys())
    dataValue2Length = len(dataValue2.keys())
    if (dataValue1Length and dataValue2Length) != 1:
        if dataValue1Length > dataValue2Length:
            divisor = dataValue2Length
        elif dataValue1Length < dataValue2Length:
            divisor = dataValue1Length
        else:
            divisor = dataValue1Length    
    return divisor

# subtracts x days from given date --> returns new date
def getNewDate(date, days):
    dateSplit = date.split("-")
    month = int(dateSplit[1])
    newDay = int(dateSplit[2]) - days
    if newDay < 1:
        month -= 1
        if int(month) < 10: month = "0" + str(month)
        newDay = getDays(month)
    if int(newDay) < 10: newDay = "0" + str(newDay)
    return dateSplit[0] + "-" + str(month) + "-" + str(newDay)

# calculates new timestamp (after average calculation)
def calculateAverageTimestamp(timestamp, averageCount):
    timeBetweenMeasurement = 5
    preTimestamp = timestamp.split("_")[1].split("-")
    currentMinute = preTimestamp[1]
    requiredAverageCount = averageCount - 1
    # calculating average time to subtract
    timeToSubtract = (timeBetweenMeasurement*requiredAverageCount)/2
    calculatedMinute = int(int(currentMinute) - timeToSubtract)
    calculatedHour = int(preTimestamp[0])
    date = timestamp.split("_")[0]
    # checking if new timestamp is valid --> prevents: 19:66
    if calculatedMinute < 0:
        calculatedMinute = 60 - calculatedMinute
        calculatedHour -= 1
    if calculatedMinute > 59:
        diff = calculatedMinute - 59
        calculatedMinute = diff
        calculatedHour += 1
    if calculatedHour < 0:
        calculatedHour = 24 - calculatedHour
        days = 1
        if calculatedHour < - 23:
            days = 2
        date = getNewDate(date, days)
    if int(calculatedHour) < 10: calculatedHour = "0" + str(calculatedHour)
    if int(calculatedMinute) < 10: calculatedMinute = "0" + str(calculatedMinute)
    # new timestamp 
    formattedNewTimestamp = date + "_" + str(calculatedHour) + "-" + str(calculatedMinute)
    return formattedNewTimestamp

# calculates average value calculation and validation
def calculateValues(dataValue1, dataValue2, value1, value2):
    calculatedValue1Data = {}
    calculatedValue2Data = {}

    # pasting dataarrays into one array with key --> required for "for"-loop
    dataArray = {
        "1":dataValue1,
        "2":dataValue2
    }
    # retrieving divisor if values and valuecount are unequal 
    # if valuecount is equal --> length of first valuearray = divisor
    if not value1 == value2:
        divisor = getDivisor(dataValue1, dataValue2)
    else:
        divisor = len(dataValue1.keys())
    valueCount = 1
    print(getTime(), "[PROCESS-INFO] dataValue1length: " + str(len(dataValue1.keys())) + ", dataValue2length: " + str(len(dataValue2.keys())) + ", divisor: " + str(divisor))

    # for value in array
    for key in dataArray.keys():
        # break if dataValue is empty bc. value1 == value2
        if list(dataArray[key].keys())[0] == "empty": break
        # retrieving length of selected dataarray
        selectedDataCount = len(dataArray[key])
        # calculating count of values for averagecalculation --> usually 1 --> no calculation required
        averageCount = int(selectedDataCount/divisor)
        counter = 0
        dataHolder = 0
        print(getTime(), "[PROCESS-INFO] selectedDataCount: " + str(selectedDataCount) + ", averageCount: " + str(averageCount))
        while (counter < averageCount) and dataArray[key].keys():
            valueKey = list(dataArray[key].keys())[0]
            selectedValue = dataArray[key][valueKey]
            counter += 1
            dataHolder += selectedValue
            # if averagecount is reached --> resetting statevariables + pasting calculated data to list
            if counter == averageCount:
                counter = 0
                calculatedValue = dataHolder/averageCount
                dataHolder = 0
                newTimestamp = calculateAverageTimestamp(valueKey, averageCount)
                if valueCount == 1:
                    calculatedValue1Data[newTimestamp] = calculatedValue
                else:
                    calculatedValue2Data[newTimestamp] = calculatedValue
            # removing entry from list 
            dataArray[key].pop(valueKey)
        # grow table/list indicator
        valueCount += 1
    # if only one value is requested
    if not calculatedValue2Data: calculatedValue2Data["empty"] = "empty"
    return calculatedValue1Data, calculatedValue2Data

# handle splitting, data retrieve and data packaging
# (the description of errorstatuscodes can be found on top of this file)
def handleCalculation(input):
    status = 10000
    data = {"dataValue1":"", "dataValue2":""}
    try: 
        print(getTime(), "splitting input: " + input)
        inputArray = splitInput(input)
    except Exception as e:
        print(e)
        status += 1
        return status, data
    try:
        print(getTime(), "retrieving database list")
        if not inputArray[2] == inputArray[4]: 
            dataBaseList = retrieveSQLDatabaseList(inputArray[2], inputArray[4])
        else: dataBaseList = [inputArray[2] + ".db"]
    except Exception as e:
        print(e)
        status += 10
        return status, data
    try:
        print(getTime(), "collecting data")
        dataValue1, dataValue2 = retrieveDataFromSQL(dataBaseList, inputArray[0], inputArray[1], inputArray[2], inputArray[3], inputArray[4], inputArray[5])
    except Exception as e:
        print(e)
        status += 100
        return status, data
    try: 
        print(getTime(), "calculating data")
        calculatedDataValue1, calculatedDataValue2 = calculateValues(dataValue1, dataValue2, inputArray[0], inputArray[1])
        data["dataValue1"] = calculatedDataValue1
        data["dataValue2"] = calculatedDataValue2
        return status, data
    except Exception as e:
        print(e)
        status += 1000
        return status, data

# subpage/fastapi register for HTTP data request
@app.get("/request/{value}")
async def root(value):
    # initialize dataretrieving and calculation
    status, data = handleCalculation(value)
    print(getTime(), "[CALCULATION-INFO] finished calculation with status: " + str(status))
    # returning status and dataarray if status == 10000
    dataSet = [{"status": status, "data": data}]
    return dataSet

# subpage/fastapi register for datarange request
@app.get("/datarange")
async def datarange():
    print(getTime(), "answering datarange request")
    # retrieving filelist
    preFileArray = os.listdir(os.getcwd() + "/dataStorage/")
    fileArray = []
    for entry in preFileArray:
        fileArray.append(entry.replace(".db", ""))
    # pasting to JSON array 
    toJSON = [{"files" : fileArray}]
    print(getTime(), "count of SQL files: " + str(len(fileArray)))
    return toJSON

# initialize webserver --> port 8000 --> runnning on localhost --> eth0/wlan0 ipv4
def serverInit():
    uvicorn.run(app, port=8000, host='0.0.0.0')

# initialize script
if __name__ == "__main__":
    print(getTime(), "started coreServer-App")
    serverInit()