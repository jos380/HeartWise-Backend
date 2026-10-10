const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long."
            });
        }

        db.get(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, existingUser) => {

                if (err) {
                    console.error("Registration database error:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: "An account with this email already exists."
                    });
                }

                try {
                    const password_hash = await bcrypt.hash(password, 10);

                    db.run(
                        `INSERT INTO users
                        (full_name, email, password_hash, role)
                        VALUES (?, ?, ?, ?)`,
                        [full_name, email, password_hash, "user"],
                        function (err) {

                            if (err) {
                                console.error("User creation error:", err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Unable to create user account."
                                });
                            }

                            return res.status(201).json({
                                success: true,
                                message: "User registered successfully.",
                                user: {
                                    id: this.lastID,
                                    full_name: full_name,
                                    email: email,
                                    role: "user"
                                }
                            });
                        }
                    );

                } catch (error) {
                    console.error("Password hashing error:", error);

                    return res.status(500).json({
                        success: false,
                        message: "Unable to process password."
                    });
                }
            }
        );

    } catch (error) {
        console.error("Unexpected registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


const login = (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env");

            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured on the server."
            });
        }

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    console.error("Login database error:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password."
                    });
                }

                try {

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password_hash
                    );

                    if (!passwordMatch) {
                        return res.status(401).json({
                            success: false,
                            message: "Invalid email or password."
                        });
                    }

                    const token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            role: user.role
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "24h"
                        }
                    );

                    return res.status(200).json({
                        success: true,
                        message: "Login successful.",
                        token: token,
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            role: user.role
                        }
                    });

                } catch (error) {

                    console.error("Login authentication error:", error);

                    return res.status(500).json({
                        success: false,
                        message: "Unable to complete login."
                    });
                }
            }
        );

    } catch (error) {

        console.error("Unexpected login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


module.exports = {
    register,
    login
};
