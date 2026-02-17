function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }

  return next();
}

module.exports = { ensureAuthenticated, ensureAdmin };
