function isUser(req,res,next){ if(req.session && req.session.user) return next(); return res.status(401).json({error:'Not authenticated'}); }
function isAdmin(req,res,next){ if(req.session && req.session.admin) return next(); return res.status(401).json({error:'Admin only'}); }
module.exports = { isUser, isAdmin };
