# REST API

Authentication: JWT based

JWT stores: user ID, (should we include role?)

User info added to `req.user` in authenticateToken 

Authorization:
 - if user enough => use JWT
 - if higher role => use JWT
 - if specific user => (handling in DB? or JWT enough?)

Revoking acceess: https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist

## TODO 
 - validating input (joi or something similar)
  
This document describes the paths provided by our REST API

## User related

These routes are used for user management 

### POST /users
 - used for signing up
 - REQUEST: 
   - BODY: {email, password, name, ...}
 - RESPONSE:
   - JWT token if input valid
   - User object
   - Error else

### POST /users/login (DONE)
 - used for logging in
 - REQUEST: 
   - BODY: {email, password}
 - RESPONSE:
   - JWT token if credentials are valid
   - User object
   - Error else

## Ticket

Managing tickets
TODO: pagination optional

### GET /tickets
 - AUTH: open?
 - RESPONSE: list of tickets
 - TODO optimization by not sending whole objects 

### GET /tickets/:ticket_id
 - AUTH: open?
 - RESPONSE: one ticket

### POST /tickets
 - AUTHORIZATION: user+
 - REQUEST:
   - BODY: {ticket_name, description, ...}
 - RESPONSE:
   - TICKET with correct ID

### PUT /tickets/:ticket_id/status?
 - Used by city manager


### PUT /tickets/:ticket_id
 - AUTHORIZATION: user (if author), city manager
 - TODO should we create separate paths for author & city manager? Because they perform can different operations with tickets.
 - REQUEST:
   - BODY: updated ticket object
 - RESPONSE:
   - TBD

### DELETE /tickets/:ticket_id
 - AUTH: author, city manager?


## Service requests

Managing service requests

AUTHORIZATION: service technician, city manager
 - unless specified differently 

### GET /service-requests
 - list of service requests

### GET /service-requests/:user_id
 - useful for filtering only assigned requests by a service
technician
  
### GET /service-requests/:request_id
 - RESPONSE: contains also assigned technicians

### POST /service-requests
 - AUTH: city manager
 - create new serice request


### PUT /service-requests/:request_id
 - AUTH: city manager, assigned technician

### DELETE /service-requests/:request_id
 - AUTH: city manager