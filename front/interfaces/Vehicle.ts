export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  kilometers: string;
  owner: {
    id: string;
    name: string;
  };
}
