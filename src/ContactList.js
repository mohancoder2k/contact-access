// src/components/ContactList.js
import React, { useState } from 'react';
import {ref, push } from 'firebase/database';
import { database } from './firebase';
import { Capacitor } from '@capacitor/core';
import { Contacts } from '@capacitor-community/contacts';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [manualContact, setManualContact] = useState({ displayName: '', phoneNumber: '' });

  const fetchContacts = async () => {
    if (Capacitor.getPlatform() === 'web') {
      alert('Contact access is not supported on web. Please use a native platform.');
      return;
    }

    try {
      const permission = await Contacts.requestPermissions();

      if (permission.granted) {
        const result = await Contacts.getContacts();
        setContacts(result.contacts);

        result.contacts.forEach(async contact => {
          try {
            await push(ref(database, 'contacts'), {
              name: contact.displayName,
              phoneNumbers: contact.phoneNumbers.map(num => num.number),
            });
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        });

        alert(`Stored ${result.contacts.length} contacts for ${name}`);
      } else {
        console.log('Permission not granted');
      }
    } catch (error) {
      console.error('Error fetching contacts: ', error);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleManualContactChange = (event) => {
    const { name, value } = event.target;
    setManualContact(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleManualContactSubmit = async () => {
    try {
      await push(ref(database, 'contacts'), {
        name: manualContact.displayName,
        phoneNumbers: [manualContact.phoneNumber],
      });
      alert(`Stored contact: ${manualContact.displayName}`);
      setManualContact({ displayName: '', phoneNumber: '' });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name} 
        onChange={handleNameChange} 
      />
      <button onClick={fetchContacts}>Fetch and Store Contacts</button>
      
      {Capacitor.getPlatform() === 'web' && (
        <div>
          <h3>Manual Contact Entry (Web Only)</h3>
          <input 
            type="text" 
            name="displayName"
            placeholder="Contact Name" 
            value={manualContact.displayName} 
            onChange={handleManualContactChange} 
          />
          <input 
            type="text" 
            name="phoneNumber"
            placeholder="Phone Number" 
            value={manualContact.phoneNumber} 
            onChange={handleManualContactChange} 
          />
          <button onClick={handleManualContactSubmit}>Add Contact</button>
        </div>
      )}
      
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            {contact.displayName} - {contact.phoneNumbers.map(num => num.number).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
