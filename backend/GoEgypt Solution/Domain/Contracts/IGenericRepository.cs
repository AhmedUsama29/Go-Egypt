using Domain.Contracts;
using Domain.Models;
using Domain.Models.Identity;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Contracs
{
    public interface IGenericRepository<TEntity, TKey> where TEntity : class
    {
        void Add(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        Task<TEntity?> GetByIdAsync(TKey id);
        Task<IEnumerable<TEntity>> GetAllAsync();

        void AddAppDb(TEntity entity);
        void UpdateAppDb(TEntity entity);
        void DeleteAppDb(TEntity entity);
        Task<IEnumerable<TEntity>> GetAllAppDbAsync(ISpecifications<TEntity> specifications);
        Task<TEntity?> GetByIdAppDbAsync(ISpecifications<TEntity> specifications);

        Task<int> CountAsync(ISpecifications<TEntity> specifications);
    }
}