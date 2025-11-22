using Domain.Contracs;
using Domain.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public static class SpecificationEvaluator
    {

        public static IQueryable<T> CreateQuery<T>(IQueryable<T> inputQuery, ISpecifications<T> specifications) where T : class
        {
            
            var query = inputQuery;
            
            if(specifications.Criteria is not null)
            {
                query = query.Where(specifications.Criteria);
            }


            if (specifications.IsPagingEnabled)
            {
                query = query.Skip(specifications.Skip).Take(specifications.Take);
            }

            foreach (var includeExpression in specifications.IncludeExpressions)
            {
                query = query.Include(includeExpression);
            }

            return query;

        }

    }
}
