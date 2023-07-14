### Live Link: [admin-digital-hut](https://admin-digital-hut.onrender.com).

## Application Routes:

### Auth (User)

- https://admin-digital-hut.onrender.com/api/v1/auth/login (POST)
- https://admin-digital-hut.onrender.com/api/v1/auth/signup (POST)
- https://admin-digital-hut.onrender.com/api/v1/auth/refresh-token (POST)

### Auth (Admin)

- https://admin-digital-hut.onrender.com/api/v1/admins/create-admin (POST)
- https://admin-digital-hut.onrender.com/api/v1/admins/login (POST)

### USER

- https://admin-digital-hut.onrender.com/api/v1/auth/signup (POST)
- https://admin-digital-hut.onrender.com/api/v1/users (GET)
- https://admin-digital-hut.onrender.com/api/v1/users/64a02bbc147ae55928022c4e
- https://admin-digital-hut.onrender.com/api/v1/users/64a02bbc147ae55928022c4e (PATCH)
- https://admin-digital-hut.onrender.com/api/v1/users/64a02bbc147ae55928022c4e (DELETE)

### Cows

- https://admin-digital-hut.onrender.com/api/v1/cows (POST)
- https://admin-digital-hut.onrender.com/api/v1/cows (GET)
- https://admin-digital-hut.onrender.com/api/v1/cows/64a03358b6cad44ef3ff60c1 (Single GET)
- https://admin-digital-hut.onrender.com/api/v1/cows/64a03358b6cad44ef3ff60c1 (PATCH)
- https://admin-digital-hut.onrender.com/api/v1/cows/64a03358b6cad44ef3ff60c1 (DELETE)

### Pagination and Filtering routes of Cows

- https://admin-digital-hut.onrender.com/api/v1/cows?page=1&limit=2
- https://admin-digital-hut.onrender.com/api/v1/cows?sortBy=price&sortOrder=asc
- https://admin-digital-hut.onrender.com/api/v1/cows?minPrice=20000&maxPrice=70000
- https://admin-digital-hut.onrender.com/api/v1/cows?location=Barishal
- https://admin-digital-hut.onrender.com/api/v1/cows?searchTerm=Cha

### Order

- https://admin-digital-hut.onrender.com/api/v1/orders (POST)
- https://admin-digital-hut.onrender.com/api/v1/orders (GET)

# Bonus

### Admin

- https://admin-digital-hut.onrender.com/api/v1/admins/create-admin (POST)

### My Profile

- https://admin-digital-hut.onrender.com/api/v1/users/my-profile (GET)
- https://admin-digital-hut.onrender.com/api/v1/users/my-profile (PATCH)

### Order:

- https://admin-digital-hut.onrender.com/api/v1/orders/64a03b719545a8165e287e1f (GET)
