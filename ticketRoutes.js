const express = require("express");

const Ticket = require("../models/Ticket");

const router = express.Router();


// =====================================================
// CREATE TICKET
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      ticketId,
      userId,
      from,
      to,
      journeyDate,
      passengers,
      fare,
    } = req.body;

    if (
      !ticketId ||
      !userId ||
      !from ||
      !to ||
      !journeyDate ||
      !passengers ||
      fare === undefined
    ) {
      return res.status(400).json({
        message: "All ticket details are required",
      });
    }

    const ticket = new Ticket({
      ticketId,
      userId,
      from,
      to,
      journeyDate,
      passengers,
      fare,
      status: "ACTIVE",
    });

    await ticket.save();

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: ticket,
    });

  } catch (error) {
    console.error("Create Ticket Error:", error);

    res.status(500).json({
      message: "Ticket booking failed",
    });
  }
});


// =====================================================
// GET USER TICKETS
// =====================================================

router.get("/:userId", async (req, res) => {
  try {
    const tickets = await Ticket.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tickets);

  } catch (error) {
    console.error("Get Tickets Error:", error);

    res.status(500).json({
      message: "Unable to fetch tickets",
    });
  }
});


// =====================================================
// CANCEL TICKET
// =====================================================

router.put("/:ticketId/cancel", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticketId: req.params.ticketId,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (ticket.status === "CANCELLED") {
      return res.status(400).json({
        message: "Ticket is already cancelled",
      });
    }

    ticket.status = "CANCELLED";

    await ticket.save();

    res.status(200).json({
      message: "Ticket cancelled successfully",
      ticket: ticket,
    });

  } catch (error) {
    console.error("Cancel Ticket Error:", error);

    res.status(500).json({
      message: "Ticket cancellation failed",
    });
  }
});


module.exports = router;