SELECT
    "users"."id",
    "users"."name",
    "users"."email",
    "users"."password",
    "users"."active",
    "users"."google",
    "users"."createdAt",
    "users"."updatedAt",
    "clothes_size_users"."id" AS "clothes_size_users.id",
    "clothes_size_users"."shirt" AS "clothes_size_users.shirt",
    "clothes_size_users"."pants" AS "clothes_size_users.pants",
    "clothes_size_users"."jacket" AS "clothes_size_users.jacket",
    "clothes_size_users"."shoes" AS "clothes_size_users.shoes",
    "clothes_size_users"."createdAt" AS "clothes_size_users.createdAt",
    "clothes_size_users"."updatedAt" AS "clothes_size_users.updatedAt",
    "clothes_size_users"."user_id" AS "clothes_size_users.user_id"
FROM "users" AS "users"
    INNER JOIN "clothes_size_users" AS "clothes_size_users" ON "users"."id" = "clothes_size_users"."user_id" AND (
        "clothes_size_users"."shirt" = 'xs'
    );