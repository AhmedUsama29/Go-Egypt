using Domain.Contracs;
using Domain.Contracts;
using Domain.Models.Identity;
using ServicesAbstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class LookupServices(IUnitOfWork _unitOfWork) : ILookupServices
    {
        public async Task<List<string>> GetNationalitiesAsync()
        {
            var repo = _unitOfWork.GetRepository<Nationality, int>();

            var allNationalities = await repo.GetAllAsync();

            var natList = allNationalities.Select(n => n.Name).ToList();

            return natList;

        }
    }
}
