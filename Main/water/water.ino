 #include <Adafruit_BMP085.h>

// Hệ thống nước uống
Adafruit_BMP085 bmp;
int greenWaterPin =2;
int redWaterPin =3; 
int pumpPin = 4; // Máy bơm 
int physicalWaterPin = 5; // Cảm biến vật cản hồng ngoại
int btnWater = 6;
int btnLedWater = 7;
int btnAuto = 8;

// Khai báo biến lưu dữ liệu

//********* CẢM BIẾN ÁP SUẤT *********
float externalPressure; //áp suất ngoài
float internalPressure; //áp suất trong
float heightWater; //chiều cao hiện tại của nước trong bình
float waterTankHeight = 14; //chiều cao của bình nước là 14cm
float percentWater,subPercentWater;

//******** TRẠNG THÁI  *********
boolean statusMachies = LOW;
boolean statusLed = LOW;
boolean statusAuto = LOW;
boolean checkButton = false;

//******** BIẾN LƯU TRỮ ĐỀ SO SÁNH *********
int greenW, redW,percelW, btnLedWArduino,machiesWArduino,btnAutoWArduino;
int btnLedWRasp, machiesWRasp,btnAutoWRasp;
void setup() {
  Serial.begin(115200);
  //scale.begin(scaleFood_DOUT_Pin,scaleFood_SCK_Pin);
  // Hệ thống nước uống
  pinMode(greenWaterPin,OUTPUT);
  pinMode(redWaterPin,OUTPUT);
  pinMode(pumpPin,OUTPUT);
  pinMode(physicalWaterPin,INPUT);
  pinMode(btnWater,INPUT_PULLUP);
  pinMode(btnLedWater,INPUT_PULLUP);
  pinMode(btnAuto,INPUT_PULLUP);

  // Đặt giá trị default 
  digitalWrite(pumpPin,LOW);
  digitalWrite(greenWaterPin,LOW);
  digitalWrite(redWaterPin,LOW);

  //Cảm biến áp suất 
  delay(1000);
   if(!bmp.begin())
   {
     Serial.println("Could not find a valid BMP085 sensor, check wiring!");
     while(true) {}
   }
  externalPressure = bmp.readPressure(); // áp suất ngoài
  // externalPressure = 101355.00; // áp suất ngoài
  // Serial.print(externalPressure);
  // Serial.println(" Pa");
  // delay(1000);


}

void loop() {
  // ******************************************* Bật tắt led *******************************************
  if(digitalRead(btnLedWater) == LOW)
  {
    delay(20);
    if(digitalRead(btnLedWater) == LOW)
    {
      if(statusLed == LOW)
      {
        btnLedWArduino = !btnLedWArduino;
        checkButton = true;
        statusLed = HIGH;
      }
    }
    statusLed = LOW;
  }

   // ******************************************* Bật tắt máy bơm nước *******************************************S
  if(digitalRead(btnWater) == LOW)
  {
    delay(20);
    if(digitalRead(btnWater) == LOW)
    {
      if(statusMachies == LOW)
      {
        machiesWArduino = !machiesWArduino;
        checkButton = true;
        statusMachies = HIGH;
      }
    }
    statusMachies = LOW;
  }

  digitalWrite(pumpPin,machiesWArduino);

  // ******************************************* Bật tắt chức năng auto *******************************************
  if(digitalRead(btnAuto) == LOW)
  {
    delay(20);
    if(digitalRead(btnAuto) == LOW)
    {
      if(statusAuto == LOW)
      {
        btnAutoWArduino = !btnAutoWArduino;
        checkButton = true;
        statusAuto = HIGH;
      }
    }
    statusAuto = LOW;
  }

  // ******************************************* Phát hiện mèo gần bình nước mở máy bơm nước *******************************************
  if(int(btnAutoWArduino) == 1)
  {

    if(digitalRead(physicalWaterPin) == 1) // Phát hiện vật cản 
    {
         digitalWrite(pumpPin,HIGH); 
         machiesWArduino = 1;
    }
    else
    {
        digitalWrite(pumpPin,LOW); 
        machiesWArduino = 0;
    }
  }
    // Serial.println(digitalRead(physicalWaterPin));

  // Serial.print("btnAuto");
  // Serial.println(btnAutoWArduino);
  
  // ******************************************* Đo lượng nước còn loại trong bình *******************************************
  internalPressure = bmp.readPressure(); // nhận áp suất trong (Pa)
  heightWater = (internalPressure - externalPressure)*0.010197162129779283; // Công thức tính chiều cao mực nước từ chênh lệch áp suất (Cm)
  percentWater = (heightWater / waterTankHeight)*100; // Phần trăm nước còn lại trong bình chứa
  if(abs(percentWater - subPercentWater) > 5)
  {
    subPercentWater = percentWater;
  }
  // Xử lí bật đèn báo hiệu
  if(btnLedWArduino == 1)
  {
    if(percentWater < 20)
    {
      digitalWrite(redWaterPin,HIGH);
      digitalWrite(greenWaterPin,LOW);
    }
    else
    {
      digitalWrite(redWaterPin,LOW);
      digitalWrite(greenWaterPin,HIGH);
    } 
  }
  else
  {
      digitalWrite(redWaterPin,LOW);
      digitalWrite(greenWaterPin,LOW);
  }

  //**************************************** Truyền dữ liệu sang raspberry ********************************************************
  String dataWater;
  //--------------------------------------------------------------- WATER ------------------------------------------------------
   if(greenW != digitalRead(greenWaterPin) || redW != digitalRead(redWaterPin)|| percelW != subPercentWater || checkButton )//percelW != subPercentWater || checkButton)
   {
     greenW = digitalRead(greenWaterPin);
     redW = digitalRead(redWaterPin);
     percelW = subPercentWater;
     dataWater = "btnLedWArduino-"+String(btnLedWArduino)+"/greenW-"+String(greenW)+"/redW-"+String(redW)+"/percentW-"+String(percelW)+"/machiesWArduino-"+String(machiesWArduino)+"/autoWArduino-"+String(btnAutoWArduino);
     Serial.println(dataWater); // Truyền dữ liệu sang cho raspberry
     checkButton = false;
     delay(200);
   }

  //**************************************** Nhận dữ liệu từ raspberry ********************************************************
  if (Serial.available()>0) //nhận được dữ liệu từ pi
  {
      String message = Serial.readStringUntil('\n');
      char *token; // biến lưu trữ từng phần tử tách ra từ chuỗi
      token = strtok(message.c_str(), "/"); // tách chuỗi theo dấu "/"
      while (token != NULL) {
        if (strstr(token, "btnLedWRasp") != NULL) { // tìm phần tử chứa chuỗi "btnLedWRasp"
          btnLedWRasp = atoi(strstr(token, "-") + 1); // lấy giá trị sau dấu "-"
        }
        if (strstr(token, "machiesWRasp") != NULL) { 
          machiesWRasp = atoi(strstr(token, "-") + 1);
        }
        if (strstr(token, "autoWRasp") != NULL) { 
          btnAutoWRasp = atoi(strstr(token, "-") + 1);
        }
        token = strtok(NULL, "/");
      }
      if(btnLedWArduino != btnLedWRasp)
      {
        btnLedWArduino = btnLedWRasp;
      }
      if(machiesWArduino != machiesWRasp)
      {
        machiesWArduino = machiesWRasp;
      }
      if(btnAutoWArduino != btnAutoWRasp)
      {
        btnAutoWArduino = btnAutoWRasp;
      }
  }
}
