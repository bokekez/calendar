"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_calendar_events", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"), // requires pgcrypto or use uuid_generate_v4()
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      googleEventId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      summary: {
        type: Sequelize.STRING,
      },
      startDateTime: {
        type: Sequelize.DATE,
      },
      endDateTime: {
        type: Sequelize.DATE,
      },
      raw: {
        type: Sequelize.JSONB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("user_calendar_events", {
      fields: ["userId", "googleEventId"],
      type: "unique",
      name: "uq_user_google_event",
    });

    await queryInterface.addIndex(
      "user_calendar_events",
      ["userId", "startDateTime"],
      { name: "idx_user_start" },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("user_calendar_events", "idx_user_start");
    await queryInterface.removeConstraint(
      "user_calendar_events",
      "uq_user_google_event",
    );
    await queryInterface.dropTable("user_calendar_events");
  },
};
