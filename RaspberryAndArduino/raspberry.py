import serial
import sys
import time
import array as arr 
import numpy as np
import pyrebase
from collections import OrderedDict
import os
#import datetime

UserID = 'BXJYrgnaKnPmdRkH5StHoLzTjSB2'
PetID = 'Pet_1682855657059'

config = {     
    "apiKey": "AIzaSyCZ92xMiEl2xzANh1hJzWioCEZv_POjbAQ",
    "authDomain": "raspberry-test-0207.firebaseapp.com",
    "databaseURL": "https://raspberry-test-0207-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "raspberry-test-0207",
    "storageBucket": "raspberry-test-0207.appspot.com",
    "messagingSenderId": "333665348767",
    "appId": "1:333665348767:web:9335583220b1c7ce02c6aa",
    "measurementId": "G-5XMV3BVGQP"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

statusSerWater = False ;  statusSerFood = False
portWater ='ttyUSB1' ; portFood='ttyUSB0'

if os.path.exists('/dev/'+portWater) : 
    serWater = serial.Serial('/dev/'+portWater, 115200, timeout=1.0)
    time.sleep(3)
    serWater.reset_input_buffer()
    statusSerWater = True
    print("Serial water OK")
if os.path.exists('/dev/'+portFood): 
    serFood = serial.Serial('/dev/'+portFood, 115200, timeout=1.0)
    time.sleep(3)
    serFood.reset_input_buffer()
    statusSerFood = True
    print("Serial food OK")


btnLedWRasp = ''; machiesWRasp = ''; btnAutoWRasp = ''
btnLedFRasp = ''; machiesFRasp = ''; btnAutoFRasp = '';feedingStatusRasp=''

arrayWeightFoodsub = [];weightBegin=0;weightEnd=0;weightFoodCurrent=0.0


def checkTime():
    monday = db.child("account/"+ UserID +"/listPet/" + PetID+'/timeEat/monday').get().val()
    midday = db.child("account/"+ UserID +"/listPet/" + PetID+'/timeEat/midday').get().val()
    night = db.child("account/"+ UserID +"/listPet/" + PetID+'/timeEat/night').get().val()
    timeNow = time.localtime()
    hour = timeNow.tm_hour
    if 1 <= hour < 11:
        if monday :
            #tách thời gian
            hour, minute = monday.split(":")
            hour = int(hour)
            minute = int(minute)
            #lấy thời gian hiện tại
            current_time = time.localtime()
            current_hour = current_time.tm_hour
            current_minute = current_time.tm_min

            updateStatus = False
            if current_hour >= hour and current_hour < 11:
                if current_hour == hour and current_minute < minute:
                    updateStatus = False
                elif current_hour == 11 and current_minute > 0:
                    updateStatus = False
                else:
                    updateStatus = True
            else:
                updateStatus = False

            if updateStatus : 
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 1,
                }
                db.update(data)
            else :
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 0,
                }
                db.update(data)
        else :
            data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 1,
                }
            db.update(data)
    elif 11 <= hour < 15:
        if midday :
            #tách thời gian
            hour, minute = midday.split(":")
            hour = int(hour)
            minute = int(minute)
            #lấy thời gian hiện tại
            current_time = time.localtime()
            current_hour = current_time.tm_hour
            current_minute = current_time.tm_min

            updateStatus = False
            if current_hour >= hour and current_hour < 15:
                if current_hour == hour and current_minute < minute:
                    updateStatus = False
                elif current_hour == 15 and current_minute > 0:
                    updateStatus = False
                else:
                    updateStatus = True
            else:
                updateStatus = False

            if updateStatus : 
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 1,
                }
                db.update(data)
            else :
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 0,
                }
                db.update(data)
        else :
            data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 1,
                }
            db.update(data)
    elif 13 <= hour < 24:
        if night :
            #tách thời gian
            hour, minute = night.split(":")
            hour = int(hour)
            minute = int(minute)
            #lấy thời gian hiện tại
            current_time = time.localtime()
            current_hour = current_time.tm_hour
            current_minute = current_time.tm_min

            updateStatus = False
            if current_hour >= hour and current_hour < 24:
                if current_hour == hour and current_minute < minute:
                    updateStatus = False
                elif current_hour == 24 and current_minute > 0:
                    updateStatus = False
                else:
                    updateStatus = True
            else:
                updateStatus = False

            if updateStatus : 
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 1,
                }
                db.update(data)
            else :
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 0,
                }
                db.update(data)
        else :
            data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 1,
                }
            db.update(data)
        
try:
    while True:

        # Cập nhật tuổi 
        #now = datetime.datetime.now()
        #DateCreate = db.child("account/"+ UserID +"/listPet/" + PetID+'/DateCreate').get().val()
        #agePet = db.child("account/"+ UserID +"/listPet/" + PetID+'/age').get().val()
        #DateCreate = datetime.datetime.strptime(DateCreate, '%Y:%m:%d')
        #if agePet and DateCreate: 
            #weeks = abs((now - DateCreate).days // 7)
            #ageNow = agePet + weeks
            #data = {
            #    "account/"+UserID+"/listPet/"+PetID+"/ageNow" : ageNow,
            #}
            #db.update(data)
        # Cập nhật cân nặng cho thú cưng
        weightManagement = db.child("account/"+ UserID +"/listPet/" + PetID+'/weightManagement').get().val()
        if weightManagement : 
            daily_weight = []

            # Lấy cân nặng cuối ngày của từng ngày và thêm vào danh sách mới
            for key, value in weightManagement.items():
                daily_weight.append((key[:10], value)) # Lấy ngày tháng và giá trị cân nặng cuối ngày

            last_weight = daily_weight[-1][1]
            data = {
                "account/"+UserID+"/listPet/"+PetID+"/health/weight" : last_weight,
            }
            db.update(data)
        
        #Cập nhật lượng calo cần trong 1 ngày
        weightPetFirebase = db.child("account/"+ UserID +"/listPet/" + PetID+'/health/weight').get().val()
        caloToFood = db.child("account/"+ UserID +"/system/food/calories").get().val()
        
        if weightPetFirebase:
            caloDay = round(float(weightPetFirebase)* 30 + 70, 2)
            weightFood =  round(caloDay*100/float(caloToFood), 2)
            data = {
                "account/"+UserID+"/listPet/"+PetID+"/health/calories" : caloDay,
                "account/"+UserID+"/listPet/"+PetID+"/health/weightFood" : weightFood,
            }
            db.update(data)

        # Cập nhật lượng đồ ăn thú cưng đã ăn và trạng thái cho thú cưng ăn 
        weightFoodFirebase = db.child("account/"+ UserID +"/listPet/" + PetID+'/health/weightFood').get().val()
        foodManagement = db.child("account/"+ UserID +"/listPet/" + PetID+'/foodManagement').get().val()
        if foodManagement and weightFoodFirebase: 
            aggregated_data = {}
            for key, value in foodManagement.items():
                date = key.split(':')[0:3]  # Extract the "YYYY:MM:DD" date component
                date_str = ":".join(date)
                if date_str not in aggregated_data:
                    aggregated_data[date_str] = 0
                aggregated_data[date_str] += value

            result = [{"date": date_str, "value": value} for date_str, value in aggregated_data.items()]
            # Lấy ngày hiện tại
            today = time.strftime('%Y:%m:%d', time.localtime())

            # Kiểm tra và lấy giá trị của ngày hôm nay
            for item in result:
                if item['date'] == today:
                    weightFoodToDay = item['value']
                    break
                else : 
                    weightFoodToDay = 0
            data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/weightFoodToDay" : weightFoodToDay,
                }
            db.update(data)

            if float(weightFoodToDay) < float(weightFoodFirebase) :
                checkTime()
            else:
                data = {
                    "account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus" : 0,
                }
                db.update(data)

        timeNow = time.localtime()
        current_time = time.strftime("%Y:%m:%d:%H:%M", timeNow)
        

        # # Xử lí hệ thống
        response_dict_water = {}
        if statusSerWater :
            if serWater.in_waiting > 0:
                response = serWater.readline().decode('utf-8').rstrip()
                print("Water : "+response)
                arrayResponse = response.split('/')
                for item in arrayResponse:
                    indexStart = item.find('-')
                    key = item[:indexStart]
                    value = item[indexStart+1:]
                    response_dict_water[key] = value
                    
                greenW = response_dict_water.get('greenW')
                redW = response_dict_water.get('redW')
                percentW = response_dict_water.get('percentW')
                btnLedWArduino = response_dict_water.get('btnLedWArduino')
                machiesWArduino = response_dict_water.get('machiesWArduino')
                btnAutoWArduino = response_dict_water.get('autoWArduino')

                if(btnLedWArduino != btnLedWRasp):
                    btnLedWRasp = btnLedWArduino
                if(machiesWArduino != machiesWRasp):
                    machiesWRasp = machiesWArduino
                if(btnAutoWArduino != btnAutoWRasp):
                    btnAutoWRasp = btnAutoWArduino

                #***************************** System *************************
                #------------------------------ Water ------------------------------
                infoSysWater = db.child("account/" + UserID + "/system/water").get().val()
                if infoSysWater:
                    if infoSysWater['ledGreen'] != greenW and greenW != None:
                        db.child("account/" + UserID + "/system/water/ledGreen").set(int(greenW))
                    if infoSysWater['ledRed'] != redW and redW != None:
                        db.child("account/" + UserID + "/system/water/ledRed").set(int(redW))
                    if infoSysWater['percent'] != percentW and percentW != None:
                        db.child("account/" + UserID + "/system/water/percent").set(int(percentW))
                    if infoSysWater['btnLed'] != btnLedWRasp and btnLedWRasp != None:
                        db.child("account/" + UserID + "/system/water/btnLed").set(int(btnLedWRasp))
                    if infoSysWater['machies'] != machiesWRasp and machiesWRasp != None:
                        db.child("account/" + UserID + "/system/water/machies").set(int(machiesWRasp))
                    if infoSysWater['auto'] != btnAutoWRasp and btnAutoWRasp != None:
                        db.child("account/" + UserID + "/system/water/auto").set(int(btnAutoWRasp))
                else:
                    dataWater = {
                        "account/"+UserID+"/system/water": {
                                                        "ledGreen": greenW,
                                                        "ledRed": redW,
                                                        "percent": percentW,
                                                        "machies": machiesWRasp,
                                                        "btnLed": btnLedWRasp,
                                                        "auto": btnAutoWRasp,
                                                    }
                    }
                    db.update(dataWater)


            infoSystemWater = db.child("account/"+ UserID +"/system/water").get().val()
            if infoSystemWater:
                checkSend = False
                stringDataWater = ''
                for key, value in infoSystemWater.items():
                    if key == 'btnLed':
                        btnLedFire = value
                    if key == 'machies':
                        machiesFire = value
                    if key == 'auto':
                        autoFire = value
                if(btnLedWRasp != btnLedFire):
                    checkSend = True
                    btnLedWRasp = btnLedFire
                    stringDataWater += "btnLedWRasp-"+str(btnLedWRasp) + "/"
                if(machiesWRasp != machiesFire):
                    checkSend = True
                    machiesWRasp = machiesFire
                    stringDataWater += "machiesWRasp-"+str(machiesWRasp) + "/" 
                if(btnAutoWRasp != autoFire):
                    checkSend = True
                    btnAutoWRasp = autoFire
                    stringDataWater += "autoWRasp-"+str(btnAutoWRasp) + "/" 
                if(checkSend == True and stringDataWater != ''):
                    stringDataWater += "\n"
                    serWater.write(stringDataWater.encode('utf-8'))
                    time.sleep(0.2)
                    print(stringDataWater)
        

        response_dict_food = {}
        if statusSerFood :
            if serFood.in_waiting > 0: 
                response = serFood.readline().decode('utf-8').rstrip()
                print("Food : "+response)
                arrayResponse = response.split('/')
                for item in arrayResponse:
                    indexStart = item.find('-')
                    key = item[:indexStart]
                    value = item[indexStart+1:]
                    response_dict_food[key] = value
                    
                greenF = response_dict_food.get('greenF')
                redF = response_dict_food.get('redF')
                percentF = response_dict_food.get('percentF')
                btnLedFArduino = response_dict_food.get('btnLedFArduino')
                machiesFArduino = response_dict_food.get('machiesFArduino')
                btnAutoFArduino = response_dict_food.get('btnAutoFArduino')
                weightFoodA = response_dict_food.get('weightFood')
                petDetection = response_dict_food.get('petDetection') 
                weightPetA = response_dict_food.get('weightPet') 

                if(btnLedFArduino != btnLedFRasp):
                    btnLedFRasp = btnLedFArduino
                if(machiesFArduino != machiesFRasp):
                    machiesFRasp = machiesFArduino
                if(btnAutoFArduino != btnAutoFRasp):
                    btnAutoFRasp = btnAutoFArduino
                
                weightPetCurrent = round(float(weightPetA)/1000,2)
                weightManagement = db.child("account/"+ UserID +"/listPet/" + PetID+'/weightManagement').get().val()
                if weightManagement : 
                    daily_weight = []

                    # Lấy cân nặng cuối ngày của từng ngày và thêm vào danh sách mới
                    for key, value in weightManagement.items():
                        daily_weight.append((key[:10], value)) # Lấy ngày tháng và giá trị cân nặng cuối ngày

                    last_weight = daily_weight[-1][1]
                    begin_weight = last_weight +0.2
                    end_weight = last_weight - 0.2
                    if(weightPetCurrent > end_weight and weightPetCurrent < begin_weight):
                        data = {
                            "account/"+UserID+"/listPet/"+PetID+"/weightManagement/" + current_time: weightPetCurrent,
                        }
                        db.update(data)
                if (int(petDetection) == 1 ) : 
                    arrayWeightFoodsub.append(float(weightFoodA)) 
                    weightBegin = max(arrayWeightFoodsub)
                else :
                    arrayWeightFoodsub.append(float(weightFoodA))
                    if len(arrayWeightFoodsub) > 2:
                        weightEnd = (float(arrayWeightFoodsub[-1]) + float(arrayWeightFoodsub[-2])) / 2
                    if weightBegin > 0 and weightEnd :
                        weightFoodCurrent =  round(float(weightBegin)-float(weightEnd),2)
                    arrayWeightFoodsub = []
                    if weightFoodCurrent != "" and weightFoodCurrent != 0:
                        print(weightBegin)
                        print(weightEnd)
                        print(float(weightBegin)-float(weightEnd))
                        data = {
                             "account/"+UserID+"/listPet/"+PetID+"/foodManagement/" + current_time: weightFoodCurrent,
                         }
                        db.update(data)


                #***************************** System *************************
                #------------------------------ FOOD ------------------------------
                infoSysFood = db.child("account/" + UserID +"/system/food").get().val()
                if infoSysFood:
                    if infoSysFood['ledGreen'] != greenF and greenF != None:
                        db.child("account/" + UserID +"/system/food/ledGreen").set(int(greenF))
                    if infoSysFood['ledRed'] != redF and redF != None:
                        db.child("account/" + UserID +"/system/food/ledRed").set(int(redF))
                    if infoSysFood['percent'] != percentF and percentF != None:                
                        db.child("account/" + UserID +"/system/food/percent").set(int(percentF))
                    if infoSysFood['btnLed'] != btnLedFRasp and btnLedFRasp != None:
                        db.child("account/" + UserID + "/system/food/btnLed").set(int(btnLedFRasp))
                    if infoSysFood['machies'] != machiesFRasp and machiesFRasp != None:
                        db.child("account/" + UserID + "/system/food/machies").set(int(machiesFRasp))
                    if infoSysFood['auto'] != btnAutoFRasp and btnAutoFRasp != None:
                        db.child("account/" + UserID + "/system/food/auto").set(int(btnAutoFRasp))
                    
                else: 
                    dataFood = {
                        "account/"+UserID+"/system/food": {
                                                    "ledGreen": greenF,
                                                    "ledRed": redF,
                                                    "percent": percentF,
                                                    "machies": machiesFRasp,
                                                    "btnLed": btnLedFRasp,
                                                    "auto": btnAutoFRasp,
                                                }
                    }
                    db.update(dataFood)

            infoSystemFood = db.child("account/"+ UserID +"/system/food").get().val()
            feedingStatus = db.child("account/"+UserID+"/listPet/"+PetID+"/health/feedingStatus").get().val()
            checkSend = False
            if infoSystemFood:
                stringDataFood = ''
                for key, value in infoSystemFood.items():
                    if key == 'btnLed':
                        btnLedFire = value
                    if key == 'machies':
                        machiesFire = value
                    if key == 'auto':
                        autoFire = value
                if(btnLedFRasp != btnLedFire):
                    checkSend = True
                    btnLedFRasp = btnLedFire
                    stringDataFood += "btnLedFRasp-"+str(btnLedFRasp) + "/"
                if(machiesFRasp != machiesFire):
                    checkSend = True
                    machiesFRasp = machiesFire
                    stringDataFood += "machiesFRasp-"+str(machiesFRasp) + "/" 
                if(btnAutoFRasp != autoFire):
                    checkSend = True
                    btnAutoFRasp = autoFire
                    stringDataFood += "autoFRasp-"+str(btnAutoFRasp) + "/" 
                if(feedingStatusRasp != feedingStatus):
                    checkSend = True
                    feedingStatusRasp = feedingStatus
                    stringDataFood += "feedingStatusRasp-"+str(feedingStatusRasp) + "/" 
                #Kiểm tra và gửi dữ liệu sang Aruino
                if(checkSend == True and stringDataFood != ''):
                    stringDataFood += "\n"
                    serFood.write(stringDataFood.encode('utf-8'))
                    time.sleep(0.2)
                    print(stringDataFood)
                    checkSend = False

except KeyboardInterrupt:
    print("Close Serial communication.")
    serWater.close()
    serFood.close()
