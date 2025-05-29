import express from 'express';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import adminMiddleware from './adminMiddlewae';
import multer from 'multer';

const prisma = new PrismaClient();

const adminRouter = express.Router();
adminRouter.use(express.json());

async function hashPassword(password:string):Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

adminRouter.post('/signup',async (req, res): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        res.status(400).json({
            msg: 'Please provide all required fields',
            status: 'error'
        });
        return;
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
        res.status(500).json({
            msg: 'Password hashing failed',
            status: 'error'
        });
        return;
    }

    try {
        const admin = await prisma.admin.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        });

        if (!admin) {
            res.status(400).json({
                msg: 'Admin creation failed',
                status: 'error'
            });
            return;
        }

        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET as string);

        res.status(201).json({
            msg: 'Admin created successfully',
            status: 'success',
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Internal server error',
            status: 'error'
        });
        return;
    }
});

async function verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

adminRouter.post('/login', async (req, res): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            msg: 'Please provide all required fields',
            status: 'error'
        });
        return;
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { email: email }
        });

        if (!admin) {
            res.status(401).json({
                msg: 'Invalid',
                status: 'error'
            });
            return;
        }

        if( !(await verifyPassword(password, admin.password))) {
            res.status(401).json({
                msg: 'Invalid email or password',
                status: 'error'
            });
            return;
        }

        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET as string);

        res.status(200).json({
            msg: 'Login successful',
            status: 'success',
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Internal server error',
            status: 'error'
        });
        return;
    }
}); 

const storage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload  = multer({
    storage: storage,
});

adminRouter.post("/add-sites",adminMiddleware,upload.single("image"), async (req, res): Promise<void> => {
    const {place,description,price,contactEmail,contactPhone} = req.body;
    let image = `${req.file?.filename}`

    if (!place || !description || !price || !image || !contactEmail || !contactPhone) {
        res.status(400).json({
            msg: 'Please provide all required fields',
            status: 'error'
        });
        return;
    }

    try{
        const site = await prisma.site.create({
            data: {
                place: place,
                description: description,
                price: parseFloat(price),
                imageUrl: image,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                sold: false
            }
        });

        if(!site) {
            res.status(400).json({
                msg: 'Site creation failed',
                status: 'error'
            });
            return;
        }

        res.status(201).json({
            msg: 'Site created successfully',
            status: 'success',
            data: site
        });

        return;

    }catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Internal server error',
            status: 'error'
        });
        return;
    }
})

export default adminRouter;