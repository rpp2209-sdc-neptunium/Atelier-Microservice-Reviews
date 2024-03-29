exports.products =  `CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id INTEGER UNIQUE NOT NULL
);`;

exports.results = `CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products (id),
  review_id INTEGER NOT NULL REFERENCES reviews (review_id)
);`;

exports.reviews = `CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  summary VARCHAR(100),
  body VARCHAR(1000),
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer INTEGER NOT NULL REFERENCES reviewers (id),
  response VARCHAR(1000),
  helpfulness INTEGER
);`;

exports.reviewers = `CREATE TABLE IF NOT EXISTS reviewers (
  id SERIAL PRIMARY KEY,
  reviewer_name VARCHAR(50),
  reviewer_email VARCHAR(100) UNIQUE
);`;

exports.reviews_photos =`CREATE TABLE IF NOT EXISTS reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url TEXT NOT NULL
);`;

exports.characteristics = `CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(100)
)`;

exports.characteristic_reviews = `CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL REFERENCES characteristics (id),
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL
)`;

exports.indexes = `
  CREATE INDEX IF NOT EXISTS products_product_id_idx ON products (product_id);
  CREATE INDEX IF NOT EXISTS results_product_id_idx ON results (product_id);
  CREATE INDEX IF NOT EXISTS results_review_id_idx ON results (review_id);
  CREATE INDEX IF NOT EXISTS reviews_id_idx ON reviews (id);
  CREATE INDEX IF NOT EXISTS reviews_photos_idx ON reviews_photos (review_id);
  CREATE INDEX IF NOT EXISTS characteristics_product_id_idx ON characteristics (product_id);
  CREATE INDEX IF NOT EXISTS characteristics_id_idx ON characteristic_reviews (characteristic_id);
`

//post ETL, to perform ELT
exports.updateReview_Photos = `
UPDATE reviews_photos
SET review_id = (
  SELECT review_id
  FROM reviews
  WHERE reviews.id = reviews_photos.review_id
)
WHERE EXISTS (
  SELECT 1
  FROM reviews
  WHERE reviews.id = reviews_photos.review_id
);`;

//took 11:58 minutes
exports.updateChar = `
UPDATE characteristic_reviews
SET review_id = COALESCE(
  (SELECT review_id
  FROM reviews
  WHERE reviews.id = characteristic_reviews.review_id),
  review_id
);
`