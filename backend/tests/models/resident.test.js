const Resident = require('../../src/models/users/resident');

describe('Resident Model Test', () => {
  
  it('should create & save a resident successfully', async () => {
    const validResident = new Resident({
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      address: '123 Street',
      contactNumber: '555-5555'
    });
    const savedResident = await validResident.save();

    expect(savedResident._id).toBeDefined();
    expect(savedResident.username).toBe('john_doe');
    expect(savedResident.totalPoints).toBe(0);  // Default value
  });

  it('should fail to create resident without required fields', async () => {
    const residentWithoutRequiredField = new Resident({
      username: 'jane_doe',
    });
    let err;
    try {
      await residentWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(Error);
    expect(err.errors['name']).toBeDefined();
  });

});
