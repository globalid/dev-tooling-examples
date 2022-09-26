var assert = require('assert');


function parseCredentialData(data) {
  // let data = holderResponse.proofPresentation.dif.verifiableCredential[0].credentialSubject;
  delete data['id']; // ID of the proof request, which isn't needed
  delete data['type'];
  
  // Change some keys to match the Janusea API
  data['full_legal_name'] = data['full_name_legal'];
  delete data['full_name_legal'];
  data['email_address'] = data['email'];
  delete data['email'];
  data['full_residence_address'] = data['address_full'];
  delete data['address_full'];
  // Check the ID type format
  if (data['id_type'].includes('SSN')) data['id_type'] = 'SSN';
  else if (data['id_type'].includes('ITIN')) data['id_type'] = 'ITIN';
  else if (data['id_type'].includes('ATIN')) data['id_type'] = 'ATIN';
  else {
    return {'error': 'Invalid ID type'};
  }
  // Strip the dashes from the SSN, and also check if it's 9 digits
  data['id_number'] = data['id_number'].replaceAll('-', '');
  if (data['id_number'].length != 9) {
    return {'error': 'Invalid ID type'};
  }
  // Remove country code if iti's present in the phone number
  if (data['phone_number'].includes('+')) {
    cur_number = data['phone_number'];
    data['phone_number'] = cur_number.substring(cur_number.length - 10);
    data['phone_number'] = data['phone_number'].substring(0, 3) + '-' + data['phone_number'].substring(3, 6) + '-' + data['phone_number'].substring(6, 10);
  } else {
    return {'error': 'Invalid phone number'};
  }

  return data;
}


function test_id_type() {
  var cred1 = {
    "id": "did:key:zUC73TZd7zxcpymXziMFHnWiZwZQHCYzc17ssnbhGkd4gpcubYBZv2rhqcJ7rCh84Vv4CF5Excn6h1dP9pjGWupK1JDTSXWAinAALRc9atJuRFnSAY5bkXZiCbaLwzBxAdAhRDz",
    "type": "Bonifii Bronze",
    "address_full": "12777 Northeast 153rd Place, Woodinville, WA, USA",
    "credential_date_of_issue": "2022-09-12",
    "credential_id": "3c92dc0a-d4a7-4b9e-b285-b23f15c07524",
    "date_of_birth": "1994-10-11",
    "email": "Marcus.imponenti@gmail.com",
    "email_verification_date": "2022-09-12",
    "full_name_legal": "Marcus Imponenti",
    "globalid_id": "1d15974c-e813-491b-a05a-089dd0b52bb9",
    "id_number": "123-45-6789",
    "id_type": "USA SSN",
    "ip_address": "98.59.137.179",
    "phone_number": "+15037247446",
    "phone_number_verification_date": "2022-09-12"
  }

  var cred2 = {
    "id": "did:key:zUC73TZd7zxcpymXziMFHnWiZwZQHCYzc17ssnbhGkd4gpcubYBZv2rhqcJ7rCh84Vv4CF5Excn6h1dP9pjGWupK1JDTSXWAinAALRc9atJuRFnSAY5bkXZiCbaLwzBxAdAhRDz",
    "type": "Bonifii Bronze",
    "address_full": "12777 Northeast 153rd Place, Woodinville, WA, USA",
    "credential_date_of_issue": "2022-09-12",
    "credential_id": "3c92dc0a-d4a7-4b9e-b285-b23f15c07524",
    "date_of_birth": "1994-10-11",
    "email": "Marcus.imponenti@gmail.com",
    "email_verification_date": "2022-09-12",
    "full_name_legal": "Marcus Imponenti",
    "globalid_id": "1d15974c-e813-491b-a05a-089dd0b52bb9",
    "id_number": "123-45-6789",
    "id_type": "USA ITIN",
    "ip_address": "98.59.137.179",
    "phone_number": "+15037247446",
    "phone_number_verification_date": "2022-09-12"
  }

  cred1 = parseCredentialData(cred1);
  assert.equal(cred1['id_type'], 'SSN');

  cred2 = parseCredentialData(cred2);
  assert.equal(cred2['id_type'], 'ITIN');

  console.log('Testing ID type is correct... passed');
}


function test_tax_number_format(data) {
  var cred1 = {
    "id": "did:key:zUC73TZd7zxcpymXziMFHnWiZwZQHCYzc17ssnbhGkd4gpcubYBZv2rhqcJ7rCh84Vv4CF5Excn6h1dP9pjGWupK1JDTSXWAinAALRc9atJuRFnSAY5bkXZiCbaLwzBxAdAhRDz",
    "type": "Bonifii Bronze",
    "address_full": "12777 Northeast 153rd Place, Woodinville, WA, USA",
    "credential_date_of_issue": "2022-09-12",
    "credential_id": "3c92dc0a-d4a7-4b9e-b285-b23f15c07524",
    "date_of_birth": "1994-10-11",
    "email": "Marcus.imponenti@gmail.com",
    "email_verification_date": "2022-09-12",
    "full_name_legal": "Marcus Imponenti",
    "globalid_id": "1d15974c-e813-491b-a05a-089dd0b52bb9",
    "id_number": "123-45-6789",
    "id_type": "USA SSN",
    "ip_address": "98.59.137.179",
    "phone_number": "+15037247446",
    "phone_number_verification_date": "2022-09-12"
  }
  var cred2 = {
    "id": "did:key:zUC73TZd7zxcpymXziMFHnWiZwZQHCYzc17ssnbhGkd4gpcubYBZv2rhqcJ7rCh84Vv4CF5Excn6h1dP9pjGWupK1JDTSXWAinAALRc9atJuRFnSAY5bkXZiCbaLwzBxAdAhRDz",
    "type": "Bonifii Bronze",
    "address_full": "12777 Northeast 153rd Place, Woodinville, WA, USA",
    "credential_date_of_issue": "2022-09-12",
    "credential_id": "3c92dc0a-d4a7-4b9e-b285-b23f15c07524",
    "date_of_birth": "1994-10-11",
    "email": "Marcus.imponenti@gmail.com",
    "email_verification_date": "2022-09-12",
    "full_name_legal": "Marcus Imponenti",
    "globalid_id": "1d15974c-e813-491b-a05a-089dd0b52bb9",
    "id_number": "123-45-678",
    "id_type": "USA SSN",
    "ip_address": "98.59.137.179",
    "phone_number": "+15037247446",
    "phone_number_verification_date": "2022-09-12"
  }

  cred1 = parseCredentialData(cred1);
  assert.equal(cred1['id_number'], '123456789');

  cred2 = parseCredentialData(cred2);
  assert.deepStrictEqual(cred2, {'error': 'Invalid ID type'});

  console.log('Testing tax number is formatted properly... passed');
}


function test_phone_number_format(data) {
  var cred1 = {
    "id": "did:key:zUC73TZd7zxcpymXziMFHnWiZwZQHCYzc17ssnbhGkd4gpcubYBZv2rhqcJ7rCh84Vv4CF5Excn6h1dP9pjGWupK1JDTSXWAinAALRc9atJuRFnSAY5bkXZiCbaLwzBxAdAhRDz",
    "type": "Bonifii Bronze",
    "address_full": "12777 Northeast 153rd Place, Woodinville, WA, USA",
    "credential_date_of_issue": "2022-09-12",
    "credential_id": "3c92dc0a-d4a7-4b9e-b285-b23f15c07524",
    "date_of_birth": "1994-10-11",
    "email": "Marcus.imponenti@gmail.com",
    "email_verification_date": "2022-09-12",
    "full_name_legal": "Marcus Imponenti",
    "globalid_id": "1d15974c-e813-491b-a05a-089dd0b52bb9",
    "id_number": "123-45-6789",
    "id_type": "USA SSN",
    "ip_address": "98.59.137.179",
    "phone_number": "+15037347446",
    "phone_number_verification_date": "2022-09-12"
  }

  cred1 = parseCredentialData(cred1);
  assert.equal(cred1['phone_number'], '503-734-7446');

  console.log('Testing phone number is formatted correctly... passed');
}

function testAll() {
  test_id_type();
  test_tax_number_format();
  test_phone_number_format();
}

testAll();