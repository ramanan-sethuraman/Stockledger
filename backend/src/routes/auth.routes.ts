import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'stockledger_jwt_secret_token_secure_2026';

// Registered users store
export let usersStore = [
  { id: 'usr-admin-01', email: 'admin@stockledger.in', password: 'Password@123', fullName: 'R. Sundaram', role: 'ADMIN' },
  { id: 'usr-sup-01', email: 'supervisor@stockledger.in', password: 'Password@123', fullName: 'K. Senthil', role: 'PRODUCTION_SUPERVISOR' },
  { id: 'usr-sales-01', email: 'salesmanA@stockledger.in', password: 'Password@123', fullName: 'M. Anand', role: 'SALES_EXECUTIVE' },
  { id: 'usr-sales-02', email: 'salesmanB@stockledger.in', password: 'Password@123', fullName: 'V. Balaji', role: 'SALES_EXECUTIVE' },
  { id: 'usr-store-01', email: 'store@stockledger.in', password: 'Password@123', fullName: 'S. Murugan', role: 'INVENTORY_MANAGER' },
  { id: 'usr-audit-01', email: 'auditor@stockledger.in', password: 'Password@123', fullName: 'CA. T. Natarajan', role: 'FINANCIAL_AUDITOR' },
];

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Email and password required' },
    });
  }

  const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
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
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    },
  });
});

authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_FAILED', message: 'Email, password, and full name are required' },
    });
  }

  const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({
      success: false,
      error: { code: 'USER_EXISTS', message: 'User with this email already exists' },
    });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: email.trim().toLowerCase(),
    password,
    fullName: fullName.trim(),
    role: role || 'SALES_EXECUTIVE',
  };

  usersStore.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, fullName: newUser.fullName, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    },
    message: 'User registered and authenticated successfully',
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
