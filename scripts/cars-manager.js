import { db } from './firebase.js';
import { 
    collection, 
    onSnapshot, 
    query, 
    where, 
    orderBy,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';

export class CarsManager {
    // Get all published cars with real-time updates
    static subscribeToCars(callback) {
        const q = query(
            collection(db, 'cars'), 
            where('published', '==', true),
            orderBy('createdAt', 'desc')
        );
        
        return onSnapshot(q, (snapshot) => {
            const cars = [];
            snapshot.forEach((doc) => {
                const carData = doc.data();
                // Ensure the car has all required fields for your existing UI
                const normalizedCar = this.normalizeCarData(carData, doc.id);
                cars.push(normalizedCar);
            });
            callback(cars);
        });
    }

    // Get featured cars only
    static subscribeToFeaturedCars(callback) {
        const q = query(
            collection(db, 'cars'), 
            where('published', '==', true),
            where('featured', '==', true),
            orderBy('createdAt', 'desc')
        );
        
        return onSnapshot(q, (snapshot) => {
            const cars = [];
            snapshot.forEach((doc) => {
                const carData = doc.data();
                const normalizedCar = this.normalizeCarData(carData, doc.id);
                cars.push(normalizedCar);
            });
            callback(cars);
        });
    }

    // Get single car by ID
    static async getCar(carId) {
        const docSnap = await getDoc(doc(db, 'cars', carId));
        if (docSnap.exists()) {
            return this.normalizeCarData(docSnap.data(), docSnap.id);
        }
        return null;
    }

    // Add new car
    static async addCar(carData) {
        const carWithMetadata = {
            ...carData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const docRef = await addDoc(collection(db, 'cars'), carWithMetadata);
        return docRef.id;
    }

    // Update car
    static async updateCar(carId, carData) {
        await updateDoc(doc(db, 'cars', carId), {
            ...carData,
            updatedAt: new Date()
        });
    }

    // Delete car
    static async deleteCar(carId) {
        await deleteDoc(doc(db, 'cars', carId));
    }

    // Normalize car data to match your existing structure
    static normalizeCarData(carData, carId) {
        return {
            id: carId,
            name: `${carData.brand} ${carData.model} ${carData.year}`,
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
            price: carData.price,
            transmission: carData.transmission || 'Automatic',
            fuel: carData.fuel || 'Petrol',
            mileage: carData.mileage || '0 km',
            status: carData.status || 'Available',
            images: carData.images || [],
            features: carData.features || [],
            location: carData.location || 'Nairobi',
            stockID: carData.stockID || carId,
            engine: carData.engine,
            color: carData.color,
            body: carData.body,
            published: carData.published !== undefined ? carData.published : true,
            featured: carData.featured || false,
            createdAt: carData.createdAt,
            updatedAt: carData.updatedAt
        };
    }
}