require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Book = require("./models/Book");

const sampleBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "James Clear breaks down behavior change into four simple laws — make it obvious, attractive, easy, and satisfying. Instead of chasing big goals, the book argues that lasting change comes from tiny, repeatable habits that compound over time. Packed with practical frameworks and real-world case studies, it's become one of the most recommended books on personal productivity and self-improvement.",
    category: "Non-fiction",
    price: 399,
    stock: 25,
    coverImage: "https://covers.openlibrary.org/b/isbn/0735211299-L.jpg",
    rating: 4.7,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "Santiago, an Andalusian shepherd boy, sets out on a journey to the Egyptian pyramids after a recurring dream promises him treasure. Along the way he meets a king, an alchemist, and a caravan of desert travelers, each teaching him something about listening to his heart and following his 'Personal Legend'. A modern fable about self-discovery that has been translated into more than 80 languages.",
    category: "Fiction",
    price: 299,
    stock: 40,
    coverImage: "https://covers.openlibrary.org/b/isbn/0062315005-L.jpg",
    rating: 4.5,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "\"Uncle Bob\" Martin lays out concrete, practical advice on naming, functions, formatting, and error handling that turns messy code into something a team can actually maintain. Built around real before-and-after refactoring examples, it explains not just what clean code looks like but why it matters for long-term software quality. A staple reference for professional software engineers.",
    category: "Academic",
    price: 649,
    stock: 15,
    coverImage: "https://covers.openlibrary.org/b/isbn/0132350882-L.jpg",
    rating: 4.6,
  },
  {
    title: "Ikigai",
    author: "Hector Garcia",
    description:
      "Drawing on interviews with residents of Okinawa — home to some of the world's longest-living people — the authors explore 'ikigai', the Japanese concept of a reason for being. The book blends everyday philosophy with practical tips on diet, movement, and community that are said to contribute to a long, purposeful life. A gentle, easy-to-read introduction to a mindset rather than a strict how-to guide.",
    category: "Non-fiction",
    price: 349,
    stock: 30,
    coverImage: "https://covers.openlibrary.org/b/isbn/0143130722-L.jpg",
    rating: 4.4,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "In a bleak future ruled by the all-seeing Party and its leader, Big Brother, Winston Smith works rewriting history for the Ministry of Truth while secretly questioning the regime he serves. Orwell's vision of surveillance, propaganda, and thought control has become a cultural touchstone, giving the world terms like 'doublethink' and 'Big Brother' that are still used today. A powerful, unsettling classic of dystopian fiction.",
    category: "Fiction",
    price: 279,
    stock: 35,
    coverImage: "https://covers.openlibrary.org/b/isbn/0451524934-L.jpg",
    rating: 4.8,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "Narrator Nick Carraway moves next door to the mysterious, fabulously wealthy Jay Gatsby, whose lavish parties mask an obsessive love for Daisy Buchanan, a woman from his past. Set against the glittering excess of 1920s Long Island, the novel is a sharp examination of ambition, class, and the hollowness at the heart of the American Dream. A slim but endlessly studied classic of 20th-century American literature.",
    category: "Fiction",
    price: 259,
    stock: 28,
    coverImage: "https://covers.openlibrary.org/b/isbn/0743273567-L.jpg",
    rating: 4.3,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description:
      "On his eleventh birthday, Harry Potter learns he isn't an ordinary boy — he's a wizard, and a famous one, invited to attend Hogwarts School of Witchcraft and Wizardry. Between spellcasting lessons, a game of Quidditch, and a three-headed dog guarding a mysterious trapdoor, Harry and his new friends Ron and Hermione uncover a plot tied to the dark wizard who killed his parents. The book that launched one of the best-selling series in publishing history.",
    category: "Fiction",
    price: 449,
    stock: 50,
    coverImage: "https://covers.openlibrary.org/b/isbn/0439708184-L.jpg",
    rating: 4.9,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description:
      "Harari traces the story of Homo sapiens from foraging bands on the African savanna to the globe-spanning, technology-driven species we are today. The book weaves together biology, anthropology, economics, and history to explain how shared myths — religion, money, nations — allowed strangers to cooperate at scale. A sweeping, big-picture read that reframes how you think about human progress.",
    category: "Non-fiction",
    price: 499,
    stock: 22,
    coverImage: "https://covers.openlibrary.org/b/isbn/0062316095-L.jpg",
    rating: 4.6,
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    description:
      "Kiyosaki contrasts the financial lessons of his two father figures — his own highly educated but financially struggling dad, and his best friend's less-schooled but wealthy 'rich dad'. The book argues that financial literacy, not income alone, is what separates people who build wealth from those who don't, introducing ideas like assets vs. liabilities in plain, story-driven language. One of the best-selling personal finance books of all time.",
    category: "Non-fiction",
    price: 329,
    stock: 33,
    coverImage: "https://covers.openlibrary.org/b/isbn/1612680194-L.jpg",
    rating: 4.5,
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    description:
      "Known widely as 'CLRS' after its four authors, this is one of the most comprehensive algorithms textbooks in print, covering sorting, graph algorithms, dynamic programming, NP-completeness, and more. Each topic is presented with rigorous pseudocode and mathematical proofs of correctness and complexity, making it a staple text in university computer science courses worldwide. Dense, but considered essential for a deep understanding of algorithm design.",
    category: "Academic",
    price: 1299,
    stock: 12,
    coverImage: "https://covers.openlibrary.org/b/isbn/0262033844-L.jpg",
    rating: 4.7,
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    description:
      "A collection of field-tested tips on everything from DRY (Don't Repeat Yourself) code and version control discipline to debugging strategies and automating your workflow. Rather than focusing on any one language or framework, the book teaches a mindset — treat your craft seriously, keep learning, and take ownership of the quality of your work. A frequently recommended read for developers early in their career.",
    category: "Academic",
    price: 599,
    stock: 18,
    coverImage: "https://covers.openlibrary.org/b/isbn/020161622X-L.jpg",
    rating: 4.6,
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    description:
      "Written by the four authors known collectively as the 'Gang of Four', this book catalogs 23 classic solutions to recurring object-oriented design problems — including Singleton, Observer, and Factory patterns. Each pattern is explained with its intent, applicability, and trade-offs, giving developers a shared vocabulary for discussing software architecture. A foundational text that shaped how an entire generation of engineers talks about code design.",
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
