import express from "express";

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.status(200).send("Hello World!");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log(`Pro-ject server is running on ${PORT}`);
});
