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
 - delete & put requests
 - PUT allowing to change photos
 - optimization when building objects from multiple tables (connection pool?)
 - foreign key contraints fix in ticket photo and comments
  
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

### GET /tickets/:ticketID DONE
 - AUTH: open?
 - RESPONSE: one ticket
 - contains also the image urls

### POST /tickets DONE
 - AUTHORIZATION: user+
 - REQUEST:
   - BODY: {ticketTitle, description, ...}
 - RESPONSE:
   - TICKET with correct ID

### POST /tickets/:id/comments DONE
 - AUTHORIZATION: user+

### PUT /tickets/:ticketID/status?
 - Used by city manager


### PUT /tickets/:ticketID DONE
 - AUTHORIZATION: user (if author), city manager
 - TODO should we create separate paths for author & city manager? Because they perform can different operations with tickets.
 - REQUEST:
   - BODY: updated ticket object
 - RESPONSE:
   - TBD

### DELETE /tickets/:ticketID
 - AUTH: author, city manager?
 - Includes list of image urls 

<!-- ### GET /tickets/:ticketID/images/:imageID -->


### POST /tickets/:ticketID/images/
- Adding new image to a ticket
- AUTHORIZATION: user (if author), city manager



## Service requests

Managing service requests

AUTHORIZATION: service technician, city manager
 - unless specified differently 

### GET /requests/list/?page DONE
 - list of service requests
 - filtering by query params
 - has filtering by parameters of the service request as well as by the assigned technician (technicianID)

### GET /requests/:requestID DONE
 - RESPONSE: contains also assigned technicians

### POST /requests DONE
 - AUTH: city manager
 - create new serice request

### PUT /requests/:requestID DONE
 - AUTH: city manager, assigned technician

### DELETE /requests/:requestID
 - AUTH: city manager

### PUT /requests/:requestID/comments DONE
 - AUTH: city manager, assigned technician