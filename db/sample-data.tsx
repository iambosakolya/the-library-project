import { hashSync } from 'bcrypt-ts-edge';

const sampleData = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: hashSync('123456', 10),
      role: 'admin'
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: hashSync('123456', 10),
      role: 'user'
    }
  ],

  products: [
    {
      name: 'The Catcher in the Rye',
      slug: 'the-catcher-in-the-rye',
      category: 'Fiction',
      description: 'A timeless classic exploring teenage rebellion and angst.',
      images: [
        '/images/sample-products/p1-1.jpg',
        '/images/sample-products/p1-2.jpg',
      ],
      price: 14.99,
      author: 'J.D. Salinger',
      rating: 4.5,
      numReviews: 1245,
      stock: 10,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'To Kill a Mockingbird',
      slug: 'to-kill-a-mockingbird',
      category: 'Fiction',
      description: 'A profound novel on racial injustice and moral growth.',
      images: [
        '/images/sample-products/p2-1.jpg',
        '/images/sample-products/p2-2.jpg',
      ],
      price: 18.99,
      author: 'Harper Lee',
      rating: 4.9,
      numReviews: 1984,
      stock: 15,
      isFeatured: true,
      banner: 'banner-2.jpg',
    },
    {
      name: '1984',
      slug: '1984',
      category: 'Dystopian',
      description: 'A chilling vision of a totalitarian future.',
      images: [
        '/images/sample-products/p3-1.jpg',
        '/images/sample-products/p3-2.jpg',
      ],
      price: 12.99,
      author: 'George Orwell',
      rating: 4.8,
      numReviews: 3125,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Pride and Prejudice',
      slug: 'pride-and-prejudice',
      category: 'Romance',
      description: 'A classic story of love and societal expectations.',
      images: [
        '/images/sample-products/p4-1.jpg',
        '/images/sample-products/p4-2.jpg',
      ],
      price: 9.99,
      author: 'Jane Austen',
      rating: 4.7,
      numReviews: 1453,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'The Great Gatsby',
      slug: 'the-great-gatsby',
      category: 'Fiction',
      description: 'A tale of love, ambition, and the American Dream.',
      images: [
        '/images/sample-products/p5-1.jpg',
        '/images/sample-products/p5-2.jpg',
      ],
      price: 15.99,
      author: 'F. Scott Fitzgerald',
      rating: 4.6,
      numReviews: 2015,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'The Hobbit',
      slug: 'the-hobbit',
      category: 'Fantasy',
      description: 'An epic adventure in Middle-earth.',
      images: [
        '/images/sample-products/p6-1.jpg',
        '/images/sample-products/p6-2.jpg',
      ],
      price: 19.99,
      author: 'J.R.R. Tolkien',
      rating: 4.8,
      numReviews: 2541,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
