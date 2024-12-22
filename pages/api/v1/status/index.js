const status = (req, res) => {
  res.status(200).json({ message: "status OK" });
};

export default status;
