export interface Company {
    _id?: string; // Optionnel car il peut ne pas être présent lors de la création
    name: string;
    address: string;
    phone: string;
    taxId: string;
    email: string;
    password?: string; // Optionnel car il peut ne pas être nécessaire dans toutes les requêtes
    logo?: string; // Chemin ou URL du logo
    signature?: string; // Chemin ou URL de la signature
  }