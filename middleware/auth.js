const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = (token) => {
  const header = jwt.decode(token, { complete: true }).header;
  
  if (header.alg === 'HS256' && header.typ === 'JWT') {
    // Use secret for HS256
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: [header.alg] });
  } else {
    // No secret for other algorithms (including "none")
    return jwt.verify(token, null, { algorithms: [header.alg] });
  }
};
// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token)
    console.log(decoded)
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};