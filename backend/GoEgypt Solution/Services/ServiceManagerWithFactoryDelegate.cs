using Microsoft.AspNetCore.Authentication;
using ServicesAbstraction;
using IAuthenticationService = ServicesAbstraction.IAuthenticationService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ServiceManagerWithFactoryDelegate(Func<IAuthenticationService> AuthFactory,
                                                    Func<ILookupServices> LookUpService,
                                                    Func<IAttractionService> AttractionFactory,
                                                    Func<IProfileService> profileFactory) : IServiceManager
    {
        public IAuthenticationService AuthenticationService => AuthFactory.Invoke();

        public ILookupServices LookupServices => LookUpService.Invoke();

        public IAttractionService AttractionService => AttractionFactory.Invoke();

        public IProfileService ProfileService => profileFactory.Invoke();
    }
}
