let itemDatabase = [
  {
    id: 12345,
    title: "example item 1",
    sellerEmail: "email@email.com",
    price: 12.34,
  },
  {
    id: 12355,
    title: "example item 2",
    sellerEmail: "email2@email.com",
    price: 12.0,
  },
];

export const searchItem = async (req, res) => {
  const items = itemDatabase;

  const { title } = req.query;
  if (!title) {
    res.status(400).send("Missing title");
    return;
  }

  //const searchItem = title.toUpperCase();
  const item = items.filter((item) =>
    item.title.toUpperCase().includes(title.toUpperCase())
  );

  if (item.length === 0) {
    res.status(404).send("Item not found").end();
    return;
  }

  res.status(200).send(item);
};
