import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'stockledger_jwt_secret_token_secure_2026';

// Standard demo credentials available out of the box
const DEMO_USERS = [
  { id: 'usr-admin-01', email: 'admin@stockledger.in', fullName: 'Dr. R. Ramanan', role: 'ADMIN' },
  { id: 'usr-sup-01', email: 'supervisor@stockledger.in', fullName: 'K. Senthil', role: 'PRODUCTION_SUPERVISOR' },
  { id: 'usr-sales-01', email: 'salesmanA@stockledger.in', fullName: 'M. Anand', role: 'SALES_EXECUTIVE' },
  { id: 'usr-sales-02', email: 'salesmanB@stockledger.in', fullName: 'V. Balaji', role: 'SALES_EXECUTIVE' },
  { id: 'usr-store-01', email: 'store@stockledger.in', fullName: 'S. Murugan', role: 'INVENTORY_MANAGER' },
  { id: 'usr-audit-01', email: 'auditor@stockledger.in', fullName: 'CA. T. Natarajan', role: 'FINANCIAL_AUDITOR' },
];

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Email and password required' },
    });
  }

  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || (password !== 'Password@123' && password !== 'admin123')) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTHENTICATION_FAILED', message: 'Invalid email or password' },
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user,
    },
  });
});

authRouter.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Token required' } });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, data: decoded });
  } catch (e) {
    res.status(401).json({ success: false, error: { message: 'Invalid or expired token' } });
  }
});
