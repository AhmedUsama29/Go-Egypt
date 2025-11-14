using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ServicesAbstraction;
using Shared;
using Shared.Attractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AttractionService(IUnitOfWork _unitOfWork) : IAttractionService
    {
        public async Task<PaginatedResponse<CardAttractions>> GetAllAttractionsAsync(AttractionsQueryParams queryParams)
        {
            var repo = _unitOfWork.GetRepository<Attraction, int>();

            var query = repo.GetAllAppDbAsync();

            var totalCount = await query.CountAsync();

            var mappedQuery = query.Select(attraction => new CardAttractions
            {
                Id = attraction.Id,
                Name = attraction.Name,
                Location = attraction.Location,
                OpeningTime = attraction.OpeningTime,
                ClosingTime = attraction.ClosingTime,
                Overview = attraction.Overview,
                MainPhotoPath = attraction.MainPhotoPath,
                Category = attraction.Category
            });

            var items = await mappedQuery
            .Skip((queryParams.PageIndex - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
            .ToListAsync();

            return new PaginatedResponse<CardAttractions>()
            {
                PageIndex = queryParams.PageIndex,
                PageSize = queryParams.PageSize,
                Count = totalCount,
                Data = items
            };
        }

        public async Task<AttractionDetails> GetAttractionByIdAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Attraction, int>();

            var attraction = await repo.GetByIdAppDbAsync(id) ??
                throw new AttractionNotFoundException(id);

            var mappedAttraction = new AttractionDetails()
            {
                Id = attraction.Id,
                Name = attraction.Name,
                Location = attraction.Location,
                Overview = attraction.Overview,
                OpeningTime = attraction.OpeningTime,
                ClosingTime = attraction.ClosingTime,
                MainPhotoPath = attraction.MainPhotoPath,
                Category = attraction.Category,
                Gallery = attraction.Gallery,
                KeyFacts = attraction.KeyFacts.Select(kf => new Shared.Attractions.KeyFact
                {
                    Headline = kf.Headline,
                    Description = kf.Description
                }).ToList()

            };

            return mappedAttraction;
        }

        public async Task<List<HomeAttractions>> GetHomeAttractionsAsync()
        {
            var repo = _unitOfWork.GetRepository<Attraction, int>();

            var allAttractions = await repo.GetAllAppDbAsync()
                                            .Take(4)
                                            .ToListAsync();

            var mappedAttractions = allAttractions.Select(attraction => new HomeAttractions
            {
                id = attraction.Id,
                Name = attraction.Name,
                MainPhotoPath = attraction.MainPhotoPath,
                Location = attraction.Location,
                OpeningTime = attraction.OpeningTime,
                ClosingTime = attraction.ClosingTime
            }).ToList();

            return mappedAttractions;
        
        }
    }
}
