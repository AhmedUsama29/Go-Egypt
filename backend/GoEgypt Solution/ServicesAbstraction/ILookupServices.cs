using Shared.Lookup;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface ILookupServices
    {

        Task<List<NationalityResponse>> GetNationalitiesAsync();
    }
}
