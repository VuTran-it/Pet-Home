#include "HX711.h"
HX711 scale;
HX711 scale2;

// Hệ thống cho ăn 
int btnAuto = 22;
int btnFood = 23;
int btnLedFood = 24;
int btnReset = 25;
int step_Ena = 26;
int step_Dir = 27;
int step_Step = 28;
int physicalFoodPin = 29;
// HX711 circuit wiring
const int LOADCELL_SCK_PIN = 30;
const int LOADCELL_DOUT_PIN = 31;
int hc_Sr04_Echo = 32;
int hc_Sr04_Trig = 33;
int greenFoodPin = 34;
int redFoodPin = 35;
const int LOADCELL_DOUT_PIN_2 = 36;
const int LOADCELL_SCK_PIN_2 = 37;

// Khai báo giá trị và biến lưu trữ 
float calibration_factor = 510.f; // giá trị này bạn lấy từ code hiệu chỉnh cho cân đồ ăn
float calibration_factor2 = 108.f; // giá trị này bạn lấy từ code hiệu chỉnh cho cân thú cưng
int tankHeight = 20; // Chiều cao bồn chứa là 19cm
float percentFood,subPercentFood;

// Trạng thái công tắc 
boolean status_BtnAuto = LOW;
boolean status_BtnFood = LOW;
boolean status_BtnLedFood = LOW;
boolean status_BtnReset = LOW;
boolean checkButton = false;
boolean status_eaten = true;

// Biến lưu trữ dữ liệu để so sánh 
int btnAutoFArduino,machiesFArduino,btnLedFArduino,btnResetFArduino,petDetection,feedingStatusArduino;
int greenF,redF,percelF,machiesF;
float weightFoodF,weightPetF;
float weightFood,weightFoodSub;
float weightPet,weightPetSub;
int btnLedFRasp, machiesFRasp,btnAutoFRasp,feedingStatusRasp;
void setup() 
{
  Serial.begin(115200);

  // Khởi tạo cân
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale2.begin(LOADCELL_DOUT_PIN_2, LOADCELL_SCK_PIN_2);

  // Khai báo chân OUTPUT
  pinMode(step_Ena,OUTPUT); // Enable pin dùng để khởi động motor
  pinMode(step_Dir,OUTPUT); // Dir xác định chiều quay
  pinMode(step_Step,OUTPUT); // Step chân xung
  pinMode(hc_Sr04_Trig,OUTPUT);   // chân trig sẽ phát tín hiệu
  pinMode(greenFoodPin,OUTPUT);   // chân trig sẽ phát tín hiệu
  pinMode(redFoodPin,OUTPUT);   // chân trig sẽ phát tín hiệu

  // Khai báo chân INPUT
  pinMode(btnAuto,INPUT_PULLUP);
  pinMode(btnFood,INPUT_PULLUP);
  pinMode(btnLedFood,INPUT_PULLUP);
  pinMode(btnReset,INPUT_PULLUP);
  pinMode(physicalFoodPin,INPUT); // Cảm biến vật cản
  pinMode(hc_Sr04_Echo,INPUT);    // chân echo sẽ nhận tín hiệu

  //LOACELL
  scale.set_scale(calibration_factor);   // this value is obtained by calibrating the scale with known weights; see the README for details
  scale.tare(); // reset the scale to 0
  scale2.set_scale(calibration_factor2);   // this value is obtained by calibrating the scale with known weights; see the README for details
  scale2.tare(); // reset the scale to 0

  // long zero_factor = scale.read_average(); //đọc thông tin 
  // Serial.print("zero_factor: ");
  // Serial.println(zero_factor);

   // Giá trị mặc định 
  handleDefault();
}
 
void loop() 
{
  //**************************************** Xử lí bấm công tắc cơ ********************************************************
  // Công tắc auto
  if(digitalRead(btnAuto) == LOW)
  {
    delay(20);
    if(digitalRead(btnAuto) == LOW)
    {
      if(status_BtnAuto == LOW)
      {
        btnAutoFArduino = !btnAutoFArduino;
        status_BtnAuto = HIGH;
        checkButton = true;
      }
    }
    status_BtnAuto = LOW;
  }
   // Công tắc mở máy cho ăn
  if(digitalRead(btnFood) == LOW)
  {
    delay(20);
    if(digitalRead(btnFood) == LOW)
    {
      if(status_BtnFood == LOW)
      {
        machiesFArduino = 1;
        checkButton = true;
      }
    }
    status_BtnFood = LOW;
  }
   // Công tắc led
  if(digitalRead(btnLedFood) == LOW)
  {
    delay(20);
    if(digitalRead(btnLedFood) == LOW)
    {
      if(status_BtnLedFood == LOW)
      {
        btnLedFArduino = !btnLedFArduino;
        checkButton = true;
      }
    }
    status_BtnLedFood = LOW;
  }
   // Công tắc reset
  if(digitalRead(btnReset) == LOW)
  {
    delay(20);
    if(digitalRead(btnReset) == LOW)
    {
      if(status_BtnReset == LOW)
      {
        handleDefault();
      }
    }
    status_BtnReset = LOW;
  }
  //**************************************** Cân lượng đồ ăn ********************************************************
  weightFoodSub = scale.get_units(5), 1;
  // xử lí chênh lệch khối lượng
  
  delay(100);
  weightFoodSub = scale.get_units(5), 1;

  if (abs(weightFoodSub - weightFood) > 1)
  {
    weightFood = weightFoodSub;
    if (weightFood < 1)
    {
      weightFoodSub =0;
      weightFood = weightFoodSub;
      scale.tare(); // reset the scale to 0
    }
  }

  // scale.power_down();              // put the ADC in sleep mode
  // delay(1000);
  // scale.power_up();
   //**************************************** Cân trọng lượng thú cưng ********************************************************
  weightPetSub = scale2.get_units(5), 1;
  // xử lí chênh lệch khối lượng
  
  delay(100);
  weightPetSub = scale2.get_units(5), 1;

  if (abs(weightPetSub - weightPet) > 10)
  {
    weightPet = weightPetSub;
    if (weightPet < 1)
    {
      weightPetSub =0;
      weightPet = weightPetSub;
      scale2.tare(); // reset the scale to 0
    }
  }

  // scale.power_down();              // put the ADC in sleep mode
  // delay(1000);
  // scale.power_up();
  

  //**************************************** Đo lượng đồ ăn còn lại trong bình ********************************************************
  unsigned long duration; // biến đo thời gian
  int foodHeight;// biến lưu khoảng cách
  
  /* Phát xung từ chân trig */
  digitalWrite(hc_Sr04_Trig,LOW);   // tắt chân trig
  delayMicroseconds(2);
  digitalWrite(hc_Sr04_Trig,HIGH);   // phát xung từ chân trig
  delayMicroseconds(5);   // xung có độ dài 5 microSeconds
  digitalWrite(hc_Sr04_Trig,LOW);   // tắt chân trig

  /* Tính toán thời gian */
  // Đo độ rộng xung HIGH ở chân echo. 
  duration = pulseIn(hc_Sr04_Echo,HIGH);  
  // Tính khoảng cách đến vật.
  foodHeight = int(duration/2/29.412);  // đơn vị tính là cm
  // Tính lượng đồ ăn còn lại trong bồn chứa
  percentFood = 100 - int(((foodHeight*1.0)/(tankHeight*1.0))*100);// Phần trăm đồ ăn còn lại trong bình chứa 
  // Serial.println(foodHeight);
  //subPercentFood = percentFood;
  if(abs(subPercentFood - percentFood) != 5)
  {
    subPercentFood = percentFood;
  }
  // Xử lí bật đèn báo hiệu
  if(btnLedFArduino == 1)
  {
    if(percentFood < 10)
    {
      digitalWrite(redFoodPin,HIGH);
      digitalWrite(greenFoodPin,LOW);
    }
    else
    {
      digitalWrite(redFoodPin,LOW);
      digitalWrite(greenFoodPin,HIGH);
    }
  }
  else
  {
      digitalWrite(redFoodPin,LOW);
      digitalWrite(greenFoodPin,LOW);
  }
  //**************************************** Xử lí cho mèo ăn  ********************************************************
  // Kiểm tra xem ở bật mode auto hay không 
  if(btnAutoFArduino == 1)
  {
    if(digitalRead(physicalFoodPin) == 1 && weightFood <= 10 && feedingStatusArduino == 1)
    {
      handleFeeding();
      machiesFArduino = 0;
      checkButton = true;
    }
  }
  else
  {
    // cho ăn và tắt sau 1 lần
    if(machiesFArduino == 1)
    {
      handleFeeding();
      machiesFArduino = 0;
      checkButton = true;
    
    }
  }

  //**************************************** Truyền dữ liệu sang raspberry ********************************************************
  String dataFood;
  if(greenF != digitalRead(greenFoodPin) || redF != digitalRead(redFoodPin) || checkButton || percelF != subPercentFood || weightFoodF != weightFood || weightPetF != weightPet ||
  petDetection != digitalRead(physicalFoodPin))
  {
    greenF = digitalRead(greenFoodPin);
    redF = digitalRead(redFoodPin);
    percelF = subPercentFood;
    weightFoodF = weightFood;
    weightPetF = weightPet; //"greenF-"+String(greenF)+"/redF-"+String(redF)+
    petDetection = digitalRead(physicalFoodPin);
    dataFood =  "/percentF-"+String(percelF)+"/weightFood-"+String(weightFoodF)+"/weightPet-"+String(weightPetF) +"/machiesFArduino-"+String(machiesFArduino) + "/btnAutoFArduino-"+String(btnAutoFArduino) +"/btnLedFArduino-"+ String(btnLedFArduino)+"/petDetection-"+String(petDetection); 
    Serial.println(dataFood); // Truyền dữ liệu sang cho raspberry
    checkButton = false;
  }
  //**************************************** Nhận dữ liệu từ raspberry ********************************************************
  if (Serial.available()>0) //nhận được dữ liệu từ pi
  {
    String message = Serial.readStringUntil('\n');
    char *token; // biến lưu trữ từng phần tử tách ra từ chuỗi
    token = strtok(message.c_str(), "/"); // tách chuỗi theo dấu "/"
    while (token != NULL) {
      if (strstr(token, "btnLedFRasp") != NULL) { // tìm phần tử chứa chuỗi "btnLedWRasp"
        btnLedFRasp = atoi(strstr(token, "-") + 1); // lấy giá trị sau dấu "-"
      }
      if (strstr(token, "machiesFRasp") != NULL) { 
        machiesFRasp = atoi(strstr(token, "-") + 1);
      }
      if (strstr(token, "autoFRasp") != NULL) { 
        btnAutoFRasp = atoi(strstr(token, "-") + 1);
      }
      if (strstr(token, "feedingStatusRasp") != NULL) { 
        feedingStatusRasp = atoi(strstr(token, "-") + 1);
      }
      token = strtok(NULL, "/");
    }
    if(btnLedFArduino != btnLedFRasp)
    {
      btnLedFArduino = btnLedFRasp;
    }
    if(machiesFArduino != machiesFRasp)
    {
      machiesFArduino = machiesFRasp;
    }
    if(btnAutoFArduino != btnAutoFRasp)   
    {
      btnAutoFArduino = btnAutoFRasp;
    }
    if(feedingStatusArduino != feedingStatusRasp)
    {
      feedingStatusArduino = feedingStatusRasp;
    }
  }
}

void handleDefault (){
  // Giá trị mặc định 
  digitalWrite(step_Ena,LOW); // Set Enable LOW - khởi động motor
  digitalWrite(greenFoodPin,LOW); // Set Enable LOW - khởi động motor
  digitalWrite(redFoodPin,LOW); // Set Enable LOW - khởi động motor
  scale.tare(); // reset the scale to 0
  scale2.tare(); // reset the scale to 0
}

void handleFeeding()
{
  digitalWrite(step_Dir,HIGH); //Chân dir dùng để xác định chiều quay (hoặc thay đổi dây của motor)
  for(int x = 0; x < 50; x++) //Quay 1 vòng
  {
    digitalWrite(step_Step,HIGH); // Cạnh lên
    delayMicroseconds(5000); //Thời gian xuất xung = tốc độ quay
    digitalWrite(step_Step,LOW); // Cạnh xuống
    delayMicroseconds(5000);
  }
}
