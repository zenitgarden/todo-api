# Todo API Spec

## Create Todo API

Endpoint: POST /api/todos

Headers :
- Authorization : token

Request Body : 
```json
{
    "title": "My todos",
    "description": "How to train a dragon",
    "categories": [     // optional
            {
                "id": "category-auijSdh31", // optional
                "name": "Belajar"
            },
            {
                "name": "Jadwal"
            },
    ],
}
```

Response Body Success : 
```json
{
    "data": {
        "id": "todo-sdfmklwjio0318",
        "title": "My todos",
        "description": "How to train a dragon",
        "categories": [
            {
                "id": "category-auijSdh31",
                "name": "Belajar"
            },
            {
                "id": "category-euikmnlurt",
                "name": "Jadwal"
            },
        ],
        "created_at": "28 Jan 2018",
    }
}
```

Response Body Error : 
```json
{
    "errors": "Title is required"
}
```

## Update Todo API

Endpoint: PUT /api/todos/:todoId

Headers :
- Authorization : token

Request Body : 
```json
{
    "title": "My todos is updated",
    "description": "How to train a dragon",
    "categories": [
            {
                "id": "category-auijSdh31",
                "name": "Belajar"
            },
    ],
}
```

Response Body Success : 
```json
{
    "data": {
        "id": "todo-sdfmklwjio0318",
        "title": "My todos is updated",
        "description": "How to train a dragon",
        "categories": [
            {
                "id": "category-auijSdh31",
                "name": "Belajar"
            },
        ],
        "created_at": "28 Jan 2018",
    }
}
```

Response Body Error : 
```json
{
    "errors": "Title is required"
}
```

## Get Todo API

Endpoint: GET /api/todos/:todoId

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "data": {
        "id": "todo-sdfmklwjio0318",
        "title": "My todos is updated",
        "description": "How to train a dragon",
        "categories": [
            {
                "id": "category-auijSdh31",
                "name": "Belajar"
            },
        ],
        "created_at": "28 Jan 2018",
    }
}
```

Response Body Error : 
```json
{
    "errors": "Todo is not found"
}
```

## List Todo API

Endpoint: GET /api/todos

Headers :
- Authorization : token

Query Params :
- search : Search by title or description, OPTIONAL.
- category : Search by category, OPTIONAL.
- page : Number of page, default 1.
- size : Size per page, default 8.

Response Body Success : 
```json
{
    "data": {
        "todos": [
            {
                "id": "todo-sdfmklwjio0318",
                "title": "My todos is updated",
                "description": "How to train a dragon",
                "categories": [
                    {
                        "id": "category-djasifh3",
                        "name": "Belajar"
                    },
                ],
                "created_at": "28 Jan 2018",
            },
            {
                "id": "todo-aau2y34ib2",
                "title": "My todos is updated 2",
                "description": "How to train a dragon 2",
                "categories": [
                    {
                        "id": "category-auijSdh31",
                        "name": "Belajar"
                    },
                    {
                        "id": "category-euikmnlurt",
                        "name": "Jadwal"
                    },
                ],
                "created_at": "28 Jan 2018",
            }
        ],
        "paging": {
            "page": 1,
            "total_pages": 2,
            "total_items": 16
        }
    }
}
```

Response Body Error : 
```json
{
    "errors": "Unauthorized"
}
```

## Delete Todo API

Endpoint: DELETE /api/todos/:todoId

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "success": "OK"
}
```

Response Body Error: 
```json
{
    "errors": "Todo is not found"
}
```





