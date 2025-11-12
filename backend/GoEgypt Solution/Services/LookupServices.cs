using Domain.Contracs;
using Domain.Contracts;
using Domain.Models.Identity;
using ServicesAbstraction;
using Shared.Lookup;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class LookupServices(IUnitOfWork _unitOfWork) : ILookupServices
    {
        public async Task<List<NationalityResponse>> GetNationalitiesAsync()
        {
            var repo = _unitOfWork.GetRepository<Nationality, int>();

            var allNationalities = await repo.GetAllAsync();

            var mappedNationalities = allNationalities.Select(n => new NationalityResponse
            {
                Id = n.Id,
                Name = n.Name,
            });

            return mappedNationalities.ToList();

        }
    }
}
