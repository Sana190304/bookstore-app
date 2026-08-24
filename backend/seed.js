require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Book = require("./models/Book");

const sampleBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    category: "Non-fiction",
    price: 399,
    stock: 25,
    coverImage: "https://covers.openlibrary.org/b/isbn/0735211299-L.jpg",
    rating: 4.7,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A shepherd boy's journey to find his personal legend.",
    category: "Fiction",
    price: 299,
    stock: 40,
    coverImage: "https://covers.openlibrary.org/b/isbn/0062315005-L.jpg",
    rating: 4.5,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship.",
    category: "Academic",
    price: 649,
    stock: 15,
    coverImage: "https://covers.openlibrary.org/b/isbn/0132350882-L.jpg",
    rating: 4.6,
  },
  {
    title: "Ikigai",
    author: "Hector Garcia",
    description: "The Japanese secret to a long and happy life.",
    category: "Non-fiction",
    price: 349,
    stock: 30,
    coverImage: "https://covers.openlibrary.org/b/isbn/0143130722-L.jpg",
    rating: 4.4,
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian vision of a totalitarian future ruled by Big Brother.",
    category: "Fiction",
    price: 279,
    stock: 35,
    coverImage: "https://covers.openlibrary.org/b/isbn/0451524934-L.jpg",
    rating: 4.8,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A tragic tale of wealth, love and the American Dream in the Jazz Age.",
    category: "Fiction",
    price: 259,
    stock: 28,
    coverImage: "https://covers.openlibrary.org/b/isbn/0743273567-L.jpg",
    rating: 4.3,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "An orphan boy discovers he is a wizard on his eleventh birthday.",
    category: "Fiction",
    price: 449,
    stock: 50,
    coverImage: "https://covers.openlibrary.org/b/isbn/0439708184-L.jpg",
    rating: 4.9,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "How Homo sapiens came to dominate the world.",
    category: "Non-fiction",
    price: 499,
    stock: 22,
    coverImage: "https://covers.openlibrary.org/b/isbn/0062316095-L.jpg",
    rating: 4.6,
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    description: "What the rich teach their kids about money that the poor and middle class do not.",
    category: "Non-fiction",
    price: 329,
    stock: 33,
    coverImage: "https://covers.openlibrary.org/b/isbn/1612680194-L.jpg",
    rating: 4.5,
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    description: "A comprehensive textbook covering a broad range of algorithms in depth.",
    category: "Academic",
    price: 1299,
    stock: 12,
    coverImage: "https://covers.openlibrary.org/b/isbn/0262033844-L.jpg",
    rating: 4.7,
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    description: "Classic tips and tricks for becoming a better, more effective programmer.",
    category: "Academic",
    price: 599,
    stock: 18,
    coverImage: "https://covers.openlibrary.org/b/isbn/020161622X-L.jpg",
    rating: 4.6,
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    description: "Elements of reusable object-oriented software — the classic Gang of Four book.",
    category: "Academic",
    price: 749,
    stock: 10,
    coverImage: "https://covers.openlibrary.org/b/isbn/0201633612-L.jpg",
    rating: 4.5,
  },
];

const runSeed = async () => {
  await connectDB();

  await Book.deleteMany();
  await Book.insertMany(sampleBooks);
  console.log("Sample books added");

  const adminExists = await User.findOne({ email: "admin@bookstore.com" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@bookstore.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin user created -> admin@bookstore.com / admin123");
  }

  console.log("Seeding done");
  process.exit();
};

runSeed();
