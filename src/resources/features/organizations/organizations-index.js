import {inject} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';
import OrganizationService from 'resources/services/organization-service';

@inject(Router, OrganizationService)
export class OrganizationsIndex {
  constructor(router, organizationService) {
    this.router = router;
    this.organizationService = organizationService;
  }

  async activate() {
    this.organizations = await this.organizationService.getAll();
    // [
    //   {
    //     "id": "a295aa48-af69-4fcb-9feb-c4ea9c350d80",
    //     "owner": {
    //       "userId": "dbac93f106724ab7a576598b63c12962",
    //       "email": "snicky700@gmail.com",
    //       "role": "owner",
    //       "createdAt": "2017-04-01T18:52:42.898Z"
    //     },
    //     "name": "default",
    //     "description": null,
    //     "users": [
    //       {
    //         "userId": "dbac93f106724ab7a576598b63c12962",
    //         "email": "snicky700@gmail.com",
    //         "role": "owner",
    //         "createdAt": "2017-04-01T18:52:42.898Z"
    //       }
    //     ],
    //     "wardens": []
    //   }
    // ]
  }

  organizationRoute(organization) {
    return this.router.generate('organizationShow', {
      organizationId: organization.id
    });
  }

}
