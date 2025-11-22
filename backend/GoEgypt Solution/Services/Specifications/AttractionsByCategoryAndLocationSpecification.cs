using Domain.Models;
using Shared.Attractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications
{
    public class AttractionsByCategoryAndLocationSpecification : BaseSpecification<Attraction>
    {
        public AttractionsByCategoryAndLocationSpecification(int id) : base(att => att.Id == id)
        {
            AddInclude(att => att.KeyFacts);
        }

        public AttractionsByCategoryAndLocationSpecification(AttractionsQueryParams attractionsQueryParams) : 
                                           base(CreateCriteria(attractionsQueryParams))
        {
            AddInclude(att => att.KeyFacts);
            ApplyPagination(pageSize: attractionsQueryParams.PageSize, pageIndex: attractionsQueryParams.PageIndex);
        }

        private static Expression<Func<Attraction, bool>> CreateCriteria(AttractionsQueryParams p)
        {
            if (p == null) return att => true;

            return att =>
                (string.IsNullOrEmpty(p.Category) || att.Category.ToLower().Contains(p.Category.ToLower())) &&
                (string.IsNullOrEmpty(p.Location) || att.Location.ToLower().Contains(p.Location.ToLower()));
        }
    }
}
