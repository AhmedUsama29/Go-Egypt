using Shared;
using Shared.Attractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface IAttractionService
    {

        Task<PaginatedResponse<CardAttractions>> GetAllAttractionsAsync(AttractionsQueryParams queryParams);
        Task<AttractionDetails> GetAttractionByIdAsync(int id);
        Task<List<HomeAttractions>> GetHomeAttractionsAsync();

    }
}
