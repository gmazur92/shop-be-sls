--CREATE EXTENSION "uuid-ossp";
--
--DROP TABLE IF EXISTS products;
--DROP TABLE IF EXISTS stocks;
--
--
--CREATE TABLE products (
--	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--	title text,
--	description text,
--	price integer
--);
--
--CREATE TABLE stocks (
--	product_id uuid,
--	count integer,
--	foreign key ("product_id") references "products" ("id")
--);
--
--INSERT INTO products (title, description, price) values
--('title1', 'description1', 1),
--('title2', 'description2', 2),
--('title3', 'description3', 3),
--('title4', 'description4', 4),
--('title5', 'description5', 5),
--('title6', 'description6', 6),
--('title7', 'description7', 7),
--('title8', 'description8', 8),
--('title9', 'description9', 9)
--
--INSERT INTO stocks (product_id, count) values
--('0cbc41b4-3e45-4633-a93a-9c6b1dd26eed', 1),
--('13056c9a-3d93-4f12-bcc2-06a24f29d850', 2),
--('1798e183-7e08-4ed9-be8e-ea8d1bcc72ad', 3),
--('1d0c1f51-c202-4dcd-8d6f-654dc4b7c21d', 4),
--('22b057e4-c49c-4196-901c-255312dfb542', 5),
--('a2b954f4-bcb8-4400-822d-e00fbf88ab4b', 6),
--('a6ea0def-9a33-49d2-a67d-aa6d707d25cb', 7),
--('afabe7bd-640b-492f-b22f-4663b3e76e79', 8),
--('d5fcdac3-f78a-4b0e-80e7-87363029364a', 9)