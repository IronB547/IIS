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

### POST /users DONE
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

### GET /tickets/unsolved/:page DONE
 - AUTH: open?
 - RESPONSE: list of unsolved tickets
 - TODO optimization by not sending whole objects 
  
### GET /tickets/solved/:page DONE
 - AUTH: open?
 - RESPONSE: list of solved tickets
 - TODO optimization by not sending whole objects 

### GET /tickets/search/:param/:page DONE
 - AUTH: open?
 - RESPONSE: list of tickets containing the param string

### GET /tickets/:ticket_id DONE
 - AUTH: open?
 - RESPONSE: one ticket
 - contains also the image urls

### POST /tickets
 - AUTHORIZATION: user+
 - REQUEST:
   - BODY: {ticket_name, description, ...}
 - RESPONSE:
   - TICKET with correct ID

### POST /tickets/:id/comments
 - AUTHORIZATION: user+

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
 - Includes list of image urls 

<!-- ### GET /tickets/:ticket_id/images/:image_id -->


### POST /tickets/:ticket_id/images/
- Adding new image to a ticket
- AUTHORIZATION: user (if author), city manager



## Service requests

Managing service requests

AUTHORIZATION: service technician, city manager
 - unless specified differently 

### GET /requests
 - list of service requests

### GET /requests/technician/:user_id
 - useful for filtering only assigned requests by a service
technician
  
### GET /requests/?ticket_id=:ticket_id&user_id=:used_id
 - searching and filtering based on query params

### GET /requests/:request_id
 - RESPONSE: contains also assigned technicians

### POST /requests
 - AUTH: city manager
 - create new serice request

### PUT /service-requests/:request_id
 - AUTH: city manager, assigned technician

### DELETE /service-requests/:request_id
 - AUTH: city manager