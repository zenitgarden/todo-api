# Category API Spec

## Create Category API

Endpoint: POST /api/category

Headers :
- Authorization : token

Request Body : 
```json
{
    "categoryName": ["Belajar"] // can be more than 1
}
```

Response Body Success : 
```json
{
    "data": [
        {
            "id": "category-auijSdh31",
            "name": "Belajar"
        }
    ]
    
}
```

Response Body Error : 
```json
{
    "errors": "categoryName max length 50"
}
```

## Update Category API

Endpoint: PUT /api/category/:categoryId

Headers :
- Authorization : token

Request Body : 
```json
{
    "categoryName": "Belajar" // can be more than 1
}
```

Response Body Success : 
```json
{
    "data": {
        "category": {
            "id": "category-auijSdh31",
            "name": "Belajar"
        }
       
    }
}
```

Response Body Error : 
```json
{
    "errors": "categoryName is required"
}
```

## Get Category API

Endpoint: GET /api/category/:categoryId

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "data": {
        "category": {
            "id": "category-auijSdh31",
            "name": "Belajar"
        }
       
    }
}
```

Response Body Error : 
```json
{
    "errors": "Category is not found"
}
```

## List Category API

Endpoint: GET /api/category/

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "data": {
        "categories": [
            {
                "id": "category-auijSdh31",
                "name": "Belajar"
            },
            {
                "id": "category-euikmnlurt",
                "name": "Jadwal"
            },
        ]
    }
}
```

Response Body Error : 
```json
{
    "errors": "Unauthorized"
}
```

## Remove Category API

Endpoint: DELETE /api/category/:categoryId

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "success": "OK"
}
```

Response Body Error : 
```json
{
    "errors": "Category is not found"
}
```






