#!/usr/bin/python3
#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 20/06/2021
# python-v  | 3.7.3
# -
# file      | WS-web_storageSync.py
# project   | rpi-weatherstation-web
# project-v | 0.1.0
#

import ftplib
import threading


# calculate average values
def calculateValues(dataValue1, dataValue2):
    calculatedValue1Data = {}
    calculatedValue2Data = {}
    dataArray = {
        "1":dataValue1,
        "2":dataValue2
    }
    divisor = getDivisor(dataValue1, dataValue2)
    valueCount = 1
    for key in dataArray.keys():
        # if dataValue is empty bc. value1 == value2
        if list(dataArray[key].keys())[0] == "empty": break
        selectedDataCount = len(dataArray[key])
        averageCount = int(selectedDataCount/divisor)
        counter = 0
        dataHolder = 0
        while (counter < averageCount) and dataArray[key].keys():
            valueKey = list(dataArray[key].keys())[0]
            selectedValue = dataArray[key][valueKey]
            counter += 1
            dataHolder += selectedValue
            if counter == averageCount:
                counter = 0
                calculatedValue = dataHolder/averageCount
                dataHolder = 0
                newTimestamp = calculateAverageTimestamp(valueKey, averageCount)
                if valueCount == 1:
                    calculatedValue1Data[newTimestamp] = calculatedValue
                else:
                    calculatedValue2Data[newTimestamp] = calculatedValue
            dataArray[key].pop(valueKey)
        valueCount += 1
    # if only one value was requested
    if not calculatedValue2Data: calculatedValue2Data["empty"] = "empty"
    return calculatedValue1Data, calculatedValue2Data

