### Live Link: [digital-hut](https://digital-hut.onrender.com/).

## Application Routes:

### USER

- api/v1/auth/signup (POST)
- api/v1/users (GET)
- api/v1/users/648d5917257722894e2fe834
- api/v1/users/648d74d853ac7f36bed71577 (PATCH)
- api/v1/users/648d5917257722894e2fe834 (DELETE)

### Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/648dc0610eee169f1a299a47 (Single GET)
- api/v1/cows/648dc0da790fcb8e37418a1c (PATCH)
- api/v1/cows/648dc0da790fcb8e37418a1c (DELETE)

### Pagination and Filtering routes of Cows

- api/v1/cows?page=1&limit=2
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Barishal
- api/v1/cows?searchTerm=Cha

### Order

- api/v1/orders (POST)
- api/v1/orders (GET)
