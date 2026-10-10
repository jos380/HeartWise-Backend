const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const adminLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: "JWT configuration is missing."
        });
    }

    db.get(
        `SELECT id, full_name, email, password_hash
         FROM admin_users
         WHERE email = ?`,
        [email.toLowerCase().trim()],
        async (error, admin) => {
            if (error) {
                console.error(error);

                return res.status(500).json({
                    success: false,
                    message: "Administrator login failed."
                });
            }

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid administrator credentials."
                });
            }

            try {
                const passwordMatch = await bcrypt.compare(
                    password,
                    admin.password_hash
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid administrator credentials."
                    });
                }

                const token = jwt.sign(
                    {
                        id: admin.id,
                        email: admin.email,
                        role: "admin",
                        account_type: "administrator"
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "24h"
                    }
                );

                return res.json({
                    success: true,
                    message: "Administrator login successful.",
                    token,
                    admin: {
                        id: admin.id,
                        full_name: admin.full_name,
                        email: admin.email,
                        role: "admin"
                    }
                });
            } catch (authError) {
                console.error(authError);

                return res.status(500).json({
                    success: false,
                    message: "Administrator authentication failed."
                });
            }
        }
    );
};

module.exports = {
    adminLogin
};