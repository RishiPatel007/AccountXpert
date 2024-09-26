import traceback
from pymongo import MongoClient
from django.http import JsonResponse
import bcrypt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from bson import ObjectId
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

import numpy as np


client = MongoClient("mongodb://localhost:27017")
db = client.mydatabase
users_collection = db.users
invoice_collection = db.invoices
product_collection = db.products
clients_collection = db.clients


@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        if users_collection.find_one({"username": username}):
            return JsonResponse({"error": "Username already exists"}, status=400)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        data["password"] = hashed_password
        users_collection.insert_one(data)
        return JsonResponse({"message": "Signup successful"}, status=201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = users_collection.find_one({"username": username})

        if user:
            if bcrypt.checkpw(password.encode("utf-8"), user["password"]):
                return JsonResponse(
                    {"message": "Login successful", "username": username}, status=200
                )
            else:
                return JsonResponse(
                    {"error": "Invalid username or password"}, status=400
                )
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "An error occurred during login"}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def createInvoice(request):
    try:
        data = json.loads(request.body)
        id = users_collection.find_one({"username": data["username"]})["_id"]
        del data["username"]
        data["user_id"] = id
        invoice_collection.insert_one(data)

        return JsonResponse({"response": "gg"}, status=201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "An error occurred during login"}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def listInvoice(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        user = users_collection.find_one({"username": username})

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        user_id = user["_id"]
        invoices = invoice_collection.find({"user_id": ObjectId(user_id)})

        invoice_list = []
        for invoice in invoices:
            invoice["_id"] = str(invoice["_id"])
            invoice["user_id"] = str(invoice["user_id"])
            invoice_list.append(invoice)
        print(len(invoice_list))
        if not invoice_list:
            return JsonResponse(
                {"error": "No invoices found for this user"}, status=404
            )

        return JsonResponse({"data": invoice_list}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def delete_invoice(request, invoice_id):
    try:
        invoice_obj_id = ObjectId(invoice_id)
        result = invoice_collection.delete_one({"_id": invoice_obj_id})

        if result.deleted_count > 0:
            return JsonResponse({"message": "Invoice deleted successfully"}, status=200)
        else:
            return JsonResponse({"message": "Invoice not found"}, status=404)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def show_invoice(request, invoice_id):
    try:
        invoice_obj_id = ObjectId(invoice_id)
        invoice = invoice_collection.find_one({"_id": invoice_obj_id})

        invoice["_id"] = str(invoice["_id"])
        invoice["user_id"] = str(invoice["user_id"])

        if invoice:
            return JsonResponse({"data": invoice}, status=200)
        else:
            return JsonResponse({"message": "Invoice not found"}, status=404)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
def update_invoice(request, invoice_id):
    try:
        invoice_obj_id = ObjectId(invoice_id)
        data = json.loads(request.body)

        data.pop("_id", None)
        data["user_id"] = ObjectId(data["user_id"])

        invoice = invoice_collection.find_one({"_id": invoice_obj_id})
        if not invoice:
            return JsonResponse({"message": "Invoice not found"}, status=404)

        result = invoice_collection.update_one({"_id": invoice_obj_id}, {"$set": data})

        if result.matched_count == 0:
            return JsonResponse({"message": "Invoice not found"}, status=404)

        return JsonResponse({"message": "Invoice updated successfully"}, status=200)
    except Exception as e:
        print("Error during update:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def getProducts(request):
    try:
        username = request.GET.get("username")
        user_id = users_collection.find_one({"username": username})["_id"]
        products = list(product_collection.find({"user_id": user_id}))
        for product in products:
            product["_id"] = str(product["_id"])
            product["user_id"] = str(product["user_id"])
        return JsonResponse({"products": products}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def addProduct(request):
    try:
        data = json.loads(request.body)
        user_id = users_collection.find_one({"username": data["username"]})["_id"]

        new_product = {
            "name": data["name"],
            "price": data["price"],
            "description": data["description"],
            "user_id": user_id,
        }
        product_collection.insert_one(new_product)

        return JsonResponse({"response": "Product added successfully"}, status=201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
def updateProduct(request, product_id):
    try:
        data = json.loads(request.body)
        updated_data = {
            "name": data["name"],
            "price": data["price"],
            "description": data["description"],
        }

        result = product_collection.update_one(
            {"_id": ObjectId(product_id)}, {"$set": updated_data}
        )

        if result.matched_count > 0:
            return JsonResponse(
                {"response": "Product updated successfully"}, status=200
            )
        else:
            return JsonResponse({"error": "Product not found"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def deleteProduct(request, product_id):
    try:
        result = product_collection.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count > 0:
            return JsonResponse(
                {"response": "Product deleted successfully"}, status=200
            )
        else:
            return JsonResponse({"error": "Product not found"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_clients(request):
    username = request.GET.get("username")
    user_id = ObjectId(users_collection.find_one({"username": username})["_id"])
    clients = list(clients_collection.find({"user_id": user_id}))
    for client in clients:
        client["_id"] = str(client["_id"])
        client["user_id"] = str(client["user_id"])
    return JsonResponse({"clients": clients}, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def add_client(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = ObjectId(
            users_collection.find_one({"username": data["username"]})["_id"]
        )
        new_client = {
            "name": data["name"],
            "address": data["address"],
            "email": data["email"],
            "phone": data["phone"],
            "user_id": user_id,
        }
        result = clients_collection.insert_one(new_client)
        return JsonResponse({"_id": str(result.inserted_id)}, status=201)


@csrf_exempt
@require_http_methods(["PUT"])
def update_client(request, client_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        update_data = {
            "name": data["name"],
            "address": data["address"],
            "email": data["email"],
            "phone": data["phone"],
        }
        clients_collection.update_one(
            {"_id": ObjectId(client_id)}, {"$set": update_data}
        )
        return JsonResponse({"status": "success"})


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_client(request, client_id):
    if request.method == "DELETE":
        clients_collection.delete_one({"_id": ObjectId(client_id)})
        return JsonResponse({"status": "success"})




@csrf_exempt
@require_http_methods(["GET"])
def get_personal_data(request):
    username = request.GET.get("username")
    user = users_collection.find_one({"username": username})
    data = {
        "businessName": user["company_details"]["name"],
        "businessEmail": user["company_details"]["email"],
        "businessAddress": user["company_details"]["address"],
        "businessPhone": user["company_details"]["phone"],
        "businessNumber": user["company_details"]["phone"],
    }
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["GET"])
def search_client(request):
    query = request.GET.get("query", "")
    clients = clients_collection.find({"name": {"$regex": query, "$options": "i"}}).limit(5)
    result = [
        {
            "name": client["name"],
            "email": client["email"],
            "address": client["address"],
            "phone": client["phone"],
        }
        for client in clients
    ]
    return JsonResponse(result, safe=False)

@csrf_exempt
@require_http_methods(["GET"])
def search_item(request):
    query = request.GET.get("query", "")
    products = product_collection.find({"name": {"$regex": query, "$options": "i"}}).limit(5    )
    result = [
        {"name": product["name"], "price": product["price"]} for product in products
    ]
    print(result)
    return JsonResponse(result, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def get_monthly_sales_data(request):

    username = request.GET.get("username")
    user_id = users_collection.find_one({"username": username})["_id"]

    current_year = datetime.now().year

    sales_data = {}
    invoices = invoice_collection.find(
        {"user_id": user_id, "invoiceDate": {"$regex": f"^{current_year}-"}}
    )

    for invoice in invoices:
        invoice_date = datetime.strptime(invoice["invoiceDate"], "%Y-%m-%d").strftime(
            "%d-%m-%Y"
        )
        total_sales = invoice.get("total", 0)

        if invoice_date in sales_data:
            sales_data[invoice_date] += total_sales
        else:
            sales_data[invoice_date] = total_sales
    sales_list = [{"date": date, "sales": sales} for date, sales in sales_data.items()]

    return JsonResponse(sales_list, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def get_sales_data(request):

    username = request.GET.get("username")
    user_id = users_collection.find_one({"username": username})["_id"]

    sales_data = {}
    invoices = invoice_collection.find(
        {
            "user_id": user_id,
        }
    )

    for invoice in invoices:
        invoice_date = datetime.strptime(invoice["invoiceDate"], "%Y-%m-%d").strftime(
            "%d-%m-%Y"
        )
        total_sales = invoice.get("total", 0)

        if invoice_date in sales_data:
            sales_data[invoice_date] += total_sales
        else:
            sales_data[invoice_date] = total_sales
    sales_list = [{"date": date, "sales": sales} for date, sales in sales_data.items()]

    return JsonResponse(sales_list, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def get_sales_forecast(request):
    username = request.GET.get("username")
    user_id = users_collection.find_one({"username": username})["_id"]

    today = datetime.now()

    current_year = today.year
    invoices = invoice_collection.find({
        "user_id": user_id,
        "invoiceDate": {"$gte": f"{current_year}-01-01", "$lt": f"{current_year + 1}-01-01"}
    })
    
    sales_data = []
    for invoice in invoices:
        invoice_date = datetime.strptime(invoice["invoiceDate"], "%Y-%m-%d")
        total_sales = invoice.get("total", 0)
        sales_data.append((invoice_date.timestamp(), total_sales))

    sales_data.sort(key=lambda x: x[0])

    dates = np.array([item[0] for item in sales_data]).reshape(-1, 1)
    sales = np.array([item[1] for item in sales_data]).reshape(-1, 1)

    poly = PolynomialFeatures(degree=2)
    dates_poly = poly.fit_transform(dates)

    model = LinearRegression()
    model.fit(dates_poly, sales)
        

    start_next_month = today + timedelta(days=(32 - today.day)) # gets next month today's date
    future_dates = []
    
    while start_next_month <= datetime(current_year + 1, 3,today.day): #from today to financial year end prediction dates 
        future_dates.append(start_next_month.timestamp())
        start_next_month = start_next_month.replace(month=start_next_month.month % 12 + 1)
        if start_next_month.month == 1:
            start_next_month = start_next_month.replace(year=start_next_month.year + 1)

    future_dates = np.array(future_dates).reshape(-1, 1)
    future_dates_poly = poly.transform(future_dates)
    predictions = model.predict(future_dates_poly)

    forecasted_sales = {
        datetime.fromtimestamp(future_dates[i][0]).strftime("%Y-%m-%d"): max(0, float(predictions[i][0]))
    for i in range(len(future_dates))
    }

    print(forecasted_sales)
    return JsonResponse(forecasted_sales)