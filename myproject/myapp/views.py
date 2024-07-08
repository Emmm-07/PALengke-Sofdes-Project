from django.shortcuts import render
from django.http import JsonResponse
from .models import Market,Account
import os
import random
from django.db.models import Q
from django.contrib.auth.hashers import check_password
import json          #a serializer - converts a list into a json string


# Create your views here.
class GlobalVar:
    def __init__(self):
        self.store_name = ""
        self.item_list = []
        self.market = []
        self.camera = None
globalVar = GlobalVar()


def start_pg(request):
    return render(request,'myapp/start_pg.html')

def login_pg(request):
    return render(request,'myapp/login_pg.html')



def menu(request):
    # market = Market.objects.values_list('item_name')
    # items_list = [item[0] for item in market]

    market = Market.objects.values('item_name','price','store','map_img','per')
    market_list = list(market)
    # print(market)
    print("===========================================")
    print(market[0]['item_name'])
    # items_list = list(set(items_list))
    # print(items_list)
    market_list = json.dumps(market_list)
    return render(request,'myapp/menu_pg.html',{'market_list':market_list})







def category(request):
    item_list = globalVar.item_list
    
    return render(request, 'myapp/category.html',{'item_list':item_list})


def store(request):
    market = globalVar.market
    return render(request, 'myapp/store.html',{'market':market,'imagePath':f"http://{request.get_host()}/static/myapp/images/media/"})


def login_pg(request):
    return render(request,'myapp/login_pg.html')


def database(request):
    store_name = globalVar.store_name
    if globalVar.store_name != "":
        markets = Market.objects.filter(store__icontains=store_name).order_by('store')
    else:
        markets = Market.objects.all().order_by('store')
    globalVar.store_name = ""
    return render(request,'myapp/database_pg.html',{'markets':markets})

def add_item(request):
    if request.method == 'POST'and request.FILES.get('imageFile'):
        print("inside here")
        
        # item_id = request.POST.get('itemId')
        item_name = request.POST.get('itemName')
        item_name = item_name.title()                   #convert it to title case
        item_categ = request.POST.get('itemCateg')
        price = request.POST.get('itemPrice')
        store = request.POST.get('store')
        per = request.POST.get('per')
        item_img = request.FILES['imageFile']

        if Market.objects.filter(item_name=item_name,store=store).exists():
            return JsonResponse({'success':True,'message':f"{item_name} already exists in the store"})

        string = store
        string = string.replace(" ","")
        string = string.replace("'","")
        string = string.lower()+"_map.gif"
        map_img = f"http://{request.get_host()}/static/myapp/images/maps/{string}"
        #  f"http://127.0.0.1:8000/static/myapp/images/maps/{string}"


        if item_categ=="Meat & Poultry":
            item_id = "MT"
        elif item_categ=="Seafoods":
            item_id = "SF"
        elif item_categ=="Vegetables":
            item_id = "VG"
        elif item_categ=="Fruits":
            item_id = "FR"
        elif item_categ=="Healthcare":
            item_id = "HC"
        else:
            item_id = "CL"

        item_id = f"{item_id}-{str(random.randrange(0,1000)).zfill(3)}"
        

        try:
            market = Market(item_id=item_id,item_name=item_name,item_categ=item_categ,price=price,store=store,item_img=item_img,map_img=map_img,per=per)
            market.save()
        except Exception as e:
            print(e)
        return JsonResponse({'success':True,'message':""})
    
    print("Error Adding")
    return JsonResponse({'success':False})


def edit_item(request):
    print("inside edit")
    if request.method == 'POST':
        new_price = request.POST.get('newPrice')
        item_id = request.POST.get('itemId')

        market = Market.objects.get(item_id=item_id)
        market.price = new_price
        market.save()

        return JsonResponse({'message':"Success"})
    
    print("Error Editing")
    return JsonResponse({'message':"Failed"})

def delete_item(request):
    if request.method == 'POST':
        item_id = request.POST.get('itemId')

        market = Market.objects.get(item_id=item_id) 
        market.delete()
        return JsonResponse({'message':"Success"})
    
    print("Error Deleting")
    return JsonResponse({'message':"Failed"})


def filter_table(request):
    if request.method == 'POST':
        store = request.POST.get('storeName')
        globalVar.store_name = store
        return JsonResponse({'message':"Success"})
    
    print("Error Filtering")
    return JsonResponse({'message':"Failed"})

def verify_account(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            account = Account.objects.get(admin_username=username)
            print(account)
            # account = Account.objects.filter(admin_username=username)    # if use filter, use it along with for loop
            # print(account)
            correct_password = check_password(password,account.admin_password)
            if correct_password:
                return JsonResponse({'success':True})
            else:
                return JsonResponse({'success':False,'wrong':'password'})
            
        except Exception as e:
            print(e)
            print("Username does not exist")
            return JsonResponse({'success':False,'wrong':'username'})   

    print('Error verifying')
    return JsonResponse({'success':False,'wrong':'request','message':"Not a POST request"})



# This is testing for face recognition --------------------------------------------------------------------------------------------------------------------------------
# from django.http import StreamingHttpResponse
import cv2
# # to install face_recognition install first cmake and dlib 
import face_recognition
#  # Load known faces and their names
known_face_encodings = []
known_face_names = []

# known_face1_img = face_recognition.load_image_file("myapp/faces/piolopascual.jpg")
# known_face2_img = face_recognition.load_image_file("myapp/faces/jm.jpg")
# known_face3_img = face_recognition.load_image_file("myapp/faces/dagul.jpg")
known_face2_img = face_recognition.load_image_file("myapp/faces/steve.jpeg")

# known_face1_encoding = face_recognition.face_encodings(known_face1_img)[0]
known_face2_encoding = face_recognition.face_encodings(known_face2_img)[0]
# known_face3_encoding = face_recognition.face_encodings(known_face2_img)[0]


# known_face_encodings.append(known_face1_encoding)
known_face_encodings.append(known_face2_encoding)
# known_face_encodings.append(known_face3_encoding)

# known_face_names.append("Piolo Pascual")
known_face_names.append("Jm")
# known_face_names.append("Dagul")
#     # Initialize webcam

# # global camera 
# # camera= cv2.VideoCapture(0)
# # print("HEREEEEE")
# # camera = None
# # global camera
# globalVar.camera= cv2.VideoCapture(0)

# def face_recog():
#     # if not camera.isOpened():
#     if globalVar.camera is None or not globalVar.camera.isOpened():
#             globalVar.camera= cv2.VideoCapture(0)
#             print("No camera")
#     while True:
#         if globalVar.camera is None:
#             globalVar.camera= cv2.VideoCapture(0)
#             print("No camera")
#             break
#         camera = globalVar.camera
#         success, img = camera.read()

#         # Find all face locations in the current frame
#         face_locations = face_recognition.face_locations(img)
#         face_encoding = face_recognition.face_encodings(img,face_locations)

#         # Loop through each face found in the frame 
#         for (top,right,bottom,left), face_encoding in zip(face_locations,face_encoding):
#             # Check if the face matches any known faces
#             matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
#             name = "Unknown"

#             if True in matches:
#                 first_match_index = matches.index(True)
#                 name = known_face_names[first_match_index]

#                 camera.release()
#                 cv2.destroyAllWindows()
#                 return JsonResponse({'message':"Hello this is from the camera"})
               
#             # Draw a box  around  the face and label with  name
#             cv2.rectangle(img, (left,top), (right,bottom), (0,0,255), 2)   
#             cv2.putText(img, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,0,255), 2)
           
#         # Display the resulting frame
#         resized_img = cv2.resize(img, (400, 400))
#         cv2.imshow("Image", resized_img)

#         # Break the loop if 'q' is pressed
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
        
#         ret, buffer = cv2.imencode('.jpg',img)
#         frame  = buffer.tobytes()
#         yield(b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
       
#     # cap.release()
#     # cv2.destroyAllWindows()

# def video_feed(request):
#     print("Herereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
#     return StreamingHttpResponse(face_recog(), content_type='multipart/x-mixed-replace; boundary=frame')

# def stop_camera(request):
#      camera = globalVar.camera
#      if camera is not None:
#         camera.release()
#         camera = None
#      return JsonResponse({'status': 'Camera feed stopped'})

from django.http import StreamingHttpResponse, JsonResponse
# import cv2
# import face_recognition

# Global variable to manage camera resource and state
# class GlobalVar:
#     camera = None
#     recognition_success = False

# globalVar = GlobalVar()
globalVar.camera= cv2.VideoCapture(0)

def generate_frames():
   
    while globalVar.camera.isOpened():
        success, img = globalVar.camera.read()
        if not success or img is None:
            break

        # Encode frame to JPEG format
        ret, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def video_feed(request):
   
    if globalVar.camera is None or not globalVar.camera.isOpened():
        globalVar.camera = cv2.VideoCapture(0)
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

def start_camera(request):
    if globalVar.camera is None or not globalVar.camera.isOpened():
        globalVar.camera = cv2.VideoCapture(0)
    return JsonResponse({'status': 'Camera started'})

def stop_camera(request):
    camera = globalVar.camera
    if camera is not None:
        camera.release()
        camera = None
    return JsonResponse({'status': 'Camera stopped'})

def face_recog(request):
    if globalVar.camera is None:
        return JsonResponse({'status': 'No camera'})
    
    success, img = globalVar.camera.read()
    if not success or img is None:
        return JsonResponse({'status': 'No image'})

    # Find all face locations in the current frame
    face_locations = face_recognition.face_locations(img)
    face_encodings = face_recognition.face_encodings(img, face_locations)

    # Loop through each face found in the frame
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # Check if the face matches any known faces
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]
            # globalVar.recognition_success = True

            camera = globalVar.camera
            if camera is not None:
                print("HERE IN face_recog(request)")
                camera.release()
                camera = None
            return JsonResponse({'status': 'success', 'name': name})

    return JsonResponse({'status': 'waiting'})
















def search_map(request):
    pass

# def upload_file(request):
#     if request.method == 'POST' and request.FILES.get('image'):
#         image = request.FILES['image']
#         market = Market.objects.get(item_id='jj')
#         try:
#             market.item_img = image
#             market.save()
#         except Exception as e:
#             print(e)
       
#         return JsonResponse({'message': 'File uploaded successfully!'})

#     return JsonResponse({'error': 'Invalid request'}, status=400)

def get_categ(request):
    if request.method == 'POST':
        category = request.POST.get('category')
        market = Market.objects.filter(item_categ=category)
        # item_names =[(item.item_name,item.item_img.name) if item in market]
        
        items  = []
        for item in market:
            if item.item_name not in [i[0] for i in items ]:
                items.append((item.item_name,f"http://{request.get_host()}/static/myapp/images/media/{item.item_img.name}"))
                print(items)

        item_names = items


        globalVar.item_list = [item_names,category]   #[[item_name,map_img],category]

        print(item_names)
        return JsonResponse({'itemNames':item_names})
    
    print("Error: not a POST request")


def get_item_name(request):
    if request.method == 'POST':
        item_name = request.POST.get('itemName')
        market = Market.objects.filter(item_name=item_name)
        globalVar.market = market

        return JsonResponse({'success':True})
    
    print("Error: not a POST request")