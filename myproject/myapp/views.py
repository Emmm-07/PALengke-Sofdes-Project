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
globalVar = GlobalVar()


def start_pg(request):
    return render(request,'myapp/start_pg.html')

def login_pg(request):
    return render(request,'myapp/login_pg.html')

def menu(request):
    market = Market.objects.values_list('item_name')
    items_list = [item[0] for item in market]
    items_list = json.dumps(items_list)
    return render(request,'myapp/menu_pg.html',{'items_list':items_list})

def database(request):
    store_name = globalVar.store_name
    if globalVar.store_name != "":
        markets = Market.objects.filter(store__icontains=store_name).order_by('store')
        for i in markets:
            print(i.store)
    else:
        markets = Market.objects.all().order_by('store')
    globalVar.store_name = ""
    return render(request,'myapp/database_pg.html',{'markets':markets})


def meats(request):
    return render(request, 'myapp/meats.html')


def add_item(request):
    if request.method == 'POST'and request.FILES.get('imageFile'):
        print("inside here")
        
        # item_id = request.POST.get('itemId')
        item_name = request.POST.get('itemName')
        item_categ = request.POST.get('itemCateg')
        price = request.POST.get('itemPrice')
        store = request.POST.get('store')
        per = request.POST.get('per')
        item_img = request.FILES['imageFile']

        map_img = f"myapp/images/maps/{store} map.png"
        
        if item_categ=="Meats":
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
        return JsonResponse({'success':True})
    
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

        
            correct_password = check_password(password,account.admin_password)
            if correct_password:
                return JsonResponse({'success':True})
            else:
                return JsonResponse({'success':False,'wrong':'password'})
            
        except Exception as e:
            return JsonResponse({'success':False,'wrong':'username'})   

    print('Error verifying')
    return JsonResponse({'success':False,'wrong':'request','message':"Not a POST request"})


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


