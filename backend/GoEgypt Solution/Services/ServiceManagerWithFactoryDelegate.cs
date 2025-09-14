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
    public class ServiceManagerWithFactoryDelegate(Func<IAuthenticationService> AuthFactory) : IServiceManager
    {
        public IAuthenticationService AuthenticationService => AuthFactory.Invoke();
    }
}
