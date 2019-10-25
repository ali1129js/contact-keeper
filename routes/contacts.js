/**
 * @Author: Ali
 * @Date:   2019-10-21T16:57:50+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-25T10:36:55+02:00
 */
const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Contact = require("../models/Contact");
const router = express.Router();
// @route   Get api/contacts
// @Desc    Get all user's contacts
// @acess   Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (e) {
    console.error(e.message);
    res.status(500).res.send("Server Error");
  }
});

// @route   POST api/contacts
// @Desc    Add new contact
// @acess   Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is require")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);
// @route   PUT api/contacts/:id
// @Desc    update a contact
// @acess   Private
router.put("/:id", async (req, res) => {
  const { name, email, phone, type } = req.body;
  //Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    //Make sure user owns contacts
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});
// @route   DELETE api/contacts/:id
// @Desc    DELETE a contact
// @acess   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    //Make sure user owns contacts
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact Removed" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
